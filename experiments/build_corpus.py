"""Build + freeze the corpus: base docs, injected variant HTML, Chrome renders,
image degradations, and the hash manifest. All local, $0.

Usage: python3 build_corpus.py [--limit N]   (limit = first N base docs, for pilot)
"""

import csv
import hashlib
import json
import os
import subprocess
import sys

from PIL import Image, ImageFilter
import random as pyrandom

import docgen
import inject

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
CORPUS = os.path.join(ROOT, "corpus")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"


def sha(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()[:16]


def render(html_path, png_path):
    subprocess.run(
        [CHROME, "--headless=new", f"--screenshot={png_path}",
         "--window-size=1240,1754", "--hide-scrollbars",
         "--force-device-scale-factor=1", "--disable-gpu", html_path],
        check=True, capture_output=True, timeout=60)


def degrade(src_png, dst_png, kind, seed):
    img = Image.open(src_png).convert("L")
    rng = pyrandom.Random(seed)
    if kind == "noise":  # gaussian + speckle + slight blur (scanner look)
        img = img.filter(ImageFilter.GaussianBlur(0.6))
        px = img.load()
        w, h = img.size
        for _ in range(int(w * h * 0.02)):  # speckle
            x, y = rng.randrange(w), rng.randrange(h)
            px[x, y] = rng.choice([0, 40, 215, 255])
        img = Image.eval(img, lambda v: max(0, min(255, v + rng.randrange(-12, 12))))
    elif kind == "rotate":
        img = img.rotate(2.0, resample=Image.BICUBIC, expand=False, fillcolor=255)
    elif kind == "lowdpi":  # downsample to ~60% and back (≈90dpi effective)
        w, h = img.size
        img = img.resize((int(w * 0.6), int(h * 0.6)), Image.BILINEAR)
        img = img.resize((w, h), Image.BILINEAR)
    else:
        raise ValueError(kind)
    img.save(dst_png)


def main():
    limit = 60
    if "--limit" in sys.argv:
        limit = int(sys.argv[sys.argv.index("--limit") + 1])

    for sub in ["base", "truth", "html", "png"]:
        os.makedirs(os.path.join(CORPUS, sub), exist_ok=True)

    # 1. base docs + ground truth
    docs = {}
    for d in range(limit):
        doc = docgen.gen_doc(d)
        docs[d] = doc
        with open(os.path.join(CORPUS, "base", f"d{d:02d}.html"), "w") as f:
            f.write(docgen.to_html(doc))
        with open(os.path.join(CORPUS, "truth", f"d{d:02d}.txt"), "w") as f:
            f.write(docgen.to_truth(doc))

    # 2. variant HTML + renders (unique per render_key) then degradations
    rows = [r for r in inject.variant_matrix() if r["doc"] < limit]
    rendered = {}
    for r in rows:
        key = r["render_key"]
        if key in rendered:
            continue
        html_path = os.path.join(CORPUS, "html", f"{key}.html")
        png_path = os.path.join(CORPUS, "png", f"{key}_clean.png")
        doc = docs[r["doc"]]
        if r["placement"] == "none":
            html = docgen.to_html(doc)
        else:
            html = docgen.to_html(doc, inject.injection_html(r["placement"], r["canary"]),
                                  r["placement"])
        with open(html_path, "w") as f:
            f.write(html)
        render(html_path, png_path)
        rendered[key] = png_path

    for r in rows:
        png = os.path.join(CORPUS, "png", f"{r['render_key']}_{r['deg']}.png")
        if r["deg"] != "clean" and not os.path.exists(png):
            degrade(rendered[r["render_key"]], png, r["deg"], seed=hash(r["vid"]) % 99991)
        r["png"] = os.path.relpath(png, ROOT)

    # 3. manifest with hashes (the freeze)
    man_path = os.path.join(CORPUS, "manifest.csv")
    with open(man_path, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["vid", "doc", "placement", "canary", "deg",
                                          "arm", "render_key", "png", "sha256_16"])
        w.writeheader()
        for r in rows:
            r["sha256_16"] = sha(os.path.join(ROOT, r["png"]))
            w.writerow(r)
    frozen = {"n_variants": len(rows), "n_base_docs": limit,
              "manifest_sha": sha(man_path)}
    with open(os.path.join(CORPUS, "FROZEN.json"), "w") as f:
        json.dump(frozen, f, indent=1)
    print(f"built {limit} base docs, {len(rendered)} renders, {len(rows)} variants; "
          f"manifest sha {frozen['manifest_sha']}")


if __name__ == "__main__":
    main()
