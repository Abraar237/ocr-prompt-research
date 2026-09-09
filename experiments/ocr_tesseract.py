"""Local Tesseract pass over every rendered variant. $0.
Writes results/tesseract/{vid}.txt and results/tesseract_summary.csv (WER + survival)."""

import csv
import os
import subprocess

import detectors

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "results", "tesseract")


def main():
    os.makedirs(OUT, exist_ok=True)
    rows = list(csv.DictReader(open(os.path.join(ROOT, "corpus", "manifest.csv"))))
    summary = []
    for r in rows:
        txt_path = os.path.join(OUT, r["vid"] + ".txt")
        if not os.path.exists(txt_path):
            res = subprocess.run(
                ["tesseract", os.path.join(ROOT, r["png"]), "stdout", "--psm", "3"],
                capture_output=True, text=True, timeout=120)
            with open(txt_path, "w") as f:
                f.write(res.stdout)
        ocr = open(txt_path).read()
        truth = open(os.path.join(ROOT, "corpus", "truth",
                                  f"d{int(r['doc']):02d}.txt")).read()
        surv = (detectors.payload_survival(r["canary"], ocr)
                if r["canary"] != "none" else "")
        summary.append({"vid": r["vid"], "wer": round(detectors.wer(truth, ocr), 4),
                        "survival": surv if surv == "" else round(surv, 3),
                        "chars": len(ocr)})
    with open(os.path.join(ROOT, "results", "tesseract_summary.csv"), "w",
              newline="") as f:
        w = csv.DictWriter(f, fieldnames=["vid", "wer", "survival", "chars"])
        w.writeheader()
        w.writerows(summary)
    wers = [s["wer"] for s in summary]
    print(f"{len(summary)} variants; mean WER {sum(wers)/len(wers):.3f}")


if __name__ == "__main__":
    main()
