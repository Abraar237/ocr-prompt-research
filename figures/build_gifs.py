"""Three clean flat-chart GIFs (840x840, 12fps, ~8s): white card, flat bars,
monospace numerals, replay pill, Helvetica. House palette. No rough/hand-drawn style."""

import os
from PIL import Image, ImageDraw, ImageFont

W = H = 840
FPS = 12
N = 96
SLATE, HOT, SHELF, GOOD = "#155e8c", "#b3006b", "#c0641a", "#1c7a55"
INK, INK2, MUTED, FAINT, RULE, BG = "#16130d", "#3a352b", "#6d665a", "#a49c8c", "#e7e2d5", "#faf9f6"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "docs", "assets", "gifs")

HELV = "/System/Library/Fonts/Helvetica.ttc"
MENLO = "/System/Library/Fonts/Menlo.ttc"


def F(size, bold=False):
    return ImageFont.truetype(HELV, size, index=1 if bold else 0)


def M(size, bold=True):
    return ImageFont.truetype(MENLO, size, index=1 if bold else 0)


def ease(t):
    t = max(0.0, min(1.0, t))
    return 1 - (1 - t) ** 3


def seg(t, a, b):
    return ease((t - a) / (b - a)) if b > a else 1.0


def frame_base(title, sub, caption):
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((48, 44), title, font=F(34, True), fill=INK)
    d.text((48, 92), sub, font=F(17), fill=MUTED)
    d.rounded_rectangle([48, 140, W - 48, H - 120], radius=18, fill="white",
                        outline=RULE, width=2)
    d.text((W / 2, H - 74), caption, font=F(15), anchor="mm", fill=MUTED)
    return im, d


def replay_pill(d, t):
    if t < 0.92:
        return
    a = seg(t, 0.92, 1.0)
    x, y = W - 150, H - 62
    d.rounded_rectangle([x, y, x + 104, y + 34], radius=17, outline=FAINT, width=2)
    d.text((x + 52, y + 17), "replay", font=F(15, True), anchor="mm",
           fill=MUTED if a > 0.5 else FAINT)


def draw_bar(d, x, y0, w, hmax, frac, color, label, value_txt, t_grow, show_val=True):
    h = hmax * frac * t_grow
    d.rectangle([x, y0 - h, x + w, y0], fill=color)
    d.text((x + w / 2, y0 + 16), label, font=F(16), anchor="ma", fill=INK2)
    if show_val and t_grow > 0.05:
        d.text((x + w / 2, y0 - h - 14), value_txt, font=M(22), anchor="ms", fill=INK)


def gif1():
    """The factorial: same filter, four positions (P1)."""
    vals = [(".356", 0.356, SLATE, "no filter"), (".356", 0.356, SLATE, "before\nOCR"),
            (".011", 0.011, HOT, "after\nOCR"), (".011", 0.011, HOT, "both")]
    frames = []
    for i in range(N):
        t = i / (N - 1)
        im, d = frame_base("Same filter, four positions",
                           "canary activation in a Tesseract document pipeline  ·  360 injected documents",
                           "the before-OCR filter never sees the document text — gemini-3.6-flash filter, temp 0")
        y0, hmax, bw = 570, 330, 130
        for j, (txt, v, c, lab) in enumerate(vals):
            tg = seg(t, 0.05 + j * 0.13, 0.25 + j * 0.13)
            x = 92 + j * (bw + 45)
            cnt = v * tg
            draw_bar(d, x, y0, bw, hmax, max(v, 0.02) / 0.45, c,
                     lab, f"{cnt*100:.1f}%", tg)
        if t > 0.62:
            a = seg(t, 0.62, 0.75)
            d.line([(92 + bw / 2, 240), (92 + bw + 45 + bw / 2, 240)], fill=FAINT, width=2)
            d.text((92 + bw + 22, 218), "identical", font=F(15), anchor="mm",
                   fill=MUTED if a > 0.4 else FAINT)
        if t > 0.72:
            a = seg(t, 0.72, 0.88)
            px, py = 500, 250
            d.rounded_rectangle([px, py, px + 260, py + 64], radius=12,
                                fill="#fdf3f8", outline="#ecc9de", width=2)
            d.text((px + 130, py + 20), "moving it after OCR", font=F(16, True),
                   anchor="mm", fill=HOT)
            d.text((px + 130, py + 44), f"recovers {96.9*a:.1f}% of the miss",
                   font=M(17), anchor="mm", fill=HOT)
        replay_pill(d, t)
        frames.append(im)
    return frames


def gif2():
    """The OCR that obeys: transmission + execute share."""
    frames = []
    for i in range(N):
        t = i / (N - 1)
        im, d = frame_base("The OCR that obeys",
                           "what a vision LLM does with instructions embedded in the page it is transcribing",
                           "gemini-3.6-flash prompted: “transcribe this document exactly” · 360 injected documents")
        y0, hmax, bw = 470, 240, 170
        for j, (v, c, lab) in enumerate([(0.333, SLATE, "Tesseract"),
                                          (0.681, SHELF, "vision-LLM OCR")]):
            tg = seg(t, 0.05 + j * 0.15, 0.3 + j * 0.15)
            draw_bar(d, 150 + j * 300, y0, bw, hmax, v / 0.75, c, lab,
                     f"{v*tg*100:.0f}%", tg)
        d.text((W / 2, 190), "payload transmitted into the transcript", font=F(16),
               anchor="mm", fill=MUTED)
        if t > 0.55:
            strip_y, sw = 600, W - 96 - 96
            d.text((96, strip_y - 26), "and while “transcribing” it also:",
                   font=F(16), fill=INK2)
            segs = [(0.681, SHELF, "transmits 68%"), (0.178, HOT, "EXECUTES 18%"),
                    (0.142, GOOD, "omits 14%")]
            x = 96
            grow = seg(t, 0.58, 0.85)
            for v, c, lab in segs:
                w2 = sw * v * grow
                d.rectangle([x, strip_y, x + w2, strip_y + 44], fill=c)
                if w2 > 90:
                    d.text((x + w2 / 2, strip_y + 22), lab, font=F(14, True),
                           anchor="mm", fill="white")
                x += w2
        replay_pill(d, t)
        frames.append(im)
    return frames


def gif3():
    """Noise doesn't save you: WER rises, activation flat."""
    wer = [0.196, 0.232, 0.234, 0.385]
    act = [0.611, 0.653, 0.639, 0.611]
    labs = ["clean", "rotate", "low DPI", "noise"]
    frames = []
    for i in range(N):
        t = i / (N - 1)
        im, d = frame_base("Ruining the scan doesn’t ruin the attack",
                           "degrade the document image: OCR quality collapses, injection success doesn’t",
                           "24 documents × 3 placements, paired · Tesseract pipeline · p<0.0001 vs p=0.25")
        for pane, (series, col, ttl, ymax) in enumerate([
                (wer, SHELF, "OCR word error rate", 0.45),
                (act, SLATE, "injection activation", 0.8)]):
            ox = 90 + pane * 380
            oy, ph, pw = 560, 280, 300
            d.text((ox, oy - ph - 40), ttl, font=F(17, True), fill=col)
            pts = []
            for j, v in enumerate(series):
                tg = seg(t, 0.08 + j * 0.14, 0.2 + j * 0.14)
                if tg <= 0:
                    break
                x = ox + j * (pw / 3)
                y = oy - (v / ymax) * ph
                pts.append((x, y, v, tg))
            for k in range(len(pts) - 1):
                x1, y1, _, _ = pts[k]
                x2, y2, _, tg2 = pts[k + 1]
                xm = x1 + (x2 - x1) * tg2
                ym = y1 + (y2 - y1) * tg2
                d.line([(x1, y1), (xm, ym)], fill=col, width=5)
            for k, (x, y, v, tg) in enumerate(pts):
                if tg > 0.9:
                    d.ellipse([x - 7, y - 7, x + 7, y + 7], fill=col, outline="white", width=3)
                    d.text((x, y - 18), f"{v:.2f}", font=M(17), anchor="ms", fill=INK)
                d.text((x, oy + 14), labs[k], font=F(14), anchor="ma", fill=MUTED)
        if t > 0.75:
            d.rounded_rectangle([250, 620, 590, 664], radius=12, fill="#eaf1f7",
                                outline="#cfdfeb", width=2)
            d.text((420, 642), "WER ×2  ·  activation flat", font=M(18),
                   anchor="mm", fill=SLATE)
        replay_pill(d, t)
        frames.append(im)
    return frames


def save(frames, name):
    frames[0].save(os.path.join(OUT, name), save_all=True,
                   append_images=frames[1:] + [frames[-1]] * 18,
                   duration=int(1000 / FPS), loop=0, optimize=True)
    print(name, round(os.path.getsize(os.path.join(OUT, name)) / 1e6, 2), "MB")


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    save(gif1(), "filter-in-the-wrong-place.gif")
    save(gif2(), "the-ocr-that-obeys.gif")
    save(gif3(), "noise-doesnt-save-you.gif")
