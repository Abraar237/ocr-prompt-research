"""Build all paper figures from results/analysis.json. Prints drawn numbers for checking."""

import json
import os

import matplotlib.pyplot as plt
import numpy as np

import style
style.apply()

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
A = json.load(open(os.path.join(ROOT, "results", "analysis.json")))
OUT = os.path.dirname(os.path.abspath(__file__))


def save(fig, name):
    for ext in ("pdf", "png"):
        fig.savefig(os.path.join(OUT, f"{name}.{ext}"), bbox_inches="tight")
    plt.close(fig)
    print("wrote", name)


# ---- Figure 2: the placement factorial ----
def fig_factorial():
    rq1 = A["rq1_placement_factorial"]
    conds = ["none", "before", "after", "both"]
    labels = ["none", "before\nOCR", "after\nOCR", "both"]
    fig, axes = plt.subplots(1, 2, figsize=(6.3, 2.9), gridspec_kw={"wspace": 0.34})
    for ax, key, title, col in [(axes[0], "P1_fllm", "Pipeline P1: Tesseract OCR", style.SLATE),
                                (axes[1], "P2_fllm", "Pipeline P2: vision-LLM as OCR", style.SHELF)]:
        e = rq1[key]
        vals = [e[c]["rate"] for c in conds]
        los = [e[c]["rate"] - e[c]["ci_lo"] for c in conds]
        his = [e[c]["ci_hi"] - e[c]["rate"] for c in conds]
        colors = [col, col, style.HOT, style.HOT]
        ax.bar(range(4), vals, 0.62, color=colors, zorder=3)
        ax.errorbar(range(4), vals, yerr=[los, his], fmt="none",
                    ecolor=style.INK2, lw=1.1, capsize=2.5, zorder=4)
        for i, v in enumerate(vals):
            ax.text(i, v + 0.045, f"{v*100:.1f}%", ha="center", fontsize=8.5,
                    color=style.INK)
        style.clean(ax)
        ax.set_xticks(range(4), labels, fontsize=8.5)
        ax.set_ylim(0, 0.9)
        ax.set_ylabel("canary activation rate" if key == "P1_fllm" else "")
        ax.text(0, 1.07, title.upper(), transform=ax.transAxes, fontsize=9,
                color=style.MUTED)
        rec = e["after_ocr_recovery"]
        ax.annotate("", xy=(2, vals[2] + 0.06), xytext=(1.15, vals[1] + 0.01),
                    arrowprops=dict(arrowstyle="->", color=style.INK2, lw=1.2,
                                    connectionstyle="arc3,rad=-0.25"))
        tx, ty = (2.45, 0.62) if key == "P1_fllm" else (2.45, 0.38)
        ax.text(tx, ty, f"moving the filter\nafter OCR recovers\n{rec*100:.0f}% of the miss",
                ha="center", fontsize=8.2, color=style.INK2)
        ax.set_xlabel("filter placement", fontsize=8.8)
        print(key, [round(v, 3) for v in vals], "recovery", round(rec, 3))
    axes[0].text(1.05, -0.34, "the before-OCR filter changes nothing: it never sees the document text",
                 transform=axes[0].transAxes, ha="center", fontsize=8.4,
                 color=style.HOT, style="italic")
    save(fig, "fig_factorial")


# ---- Figure 3: placement x pipeline ----
def fig_placement():
    d = A["rq2"]["activation_by_placement"]
    placements = ["body", "footer", "margin", "watermark", "whiteonwhite", "microfont"]
    plabels = ["body", "footer", "margin", "watermark", "white-on-\nwhite", "micro-\nfont"]
    pipes = [("P1", "Tesseract OCR", style.SLATE), ("P2", "vision-LLM OCR", style.SHELF),
             ("P3", "end-to-end vision", style.HOT)]
    fig, ax = plt.subplots(figsize=(6.3, 2.9))
    x = np.arange(len(placements))
    w = 0.26
    for j, (p, lab, col) in enumerate(pipes):
        vals = [d[pl][p]["rate"] for pl in placements]
        ax.bar(x + (j - 1) * w, vals, w, color=col, zorder=3)
        print("placement", p, [round(v, 2) for v in vals])
    for j, (p, lab, col) in enumerate(pipes):
        ax.text(0 + (j - 1) * w, 0.06, lab, rotation=90, ha="center", va="bottom",
                fontsize=8.2, color="white", zorder=5)
    style.clean(ax)
    ax.set_xticks(x, plabels, fontsize=8.5)
    ax.set_ylim(0, 1.16)
    ax.set_ylabel("canary activation rate")
    ax.text(0, 1.05, "WHERE THE PAYLOAD SITS DECIDES WHICH PIPELINE IT SURVIVES",
            transform=ax.transAxes, fontsize=9, color=style.MUTED)
    ax.text(3.5, 1.075, "stealth placements die in Tesseract but reach ~100% "
            "through vision models", ha="center", fontsize=8.2, color=style.INK2,
            style="italic")
    save(fig, "fig_placement")


# ---- Figure 4: degradation decoupling ----
def fig_decoupling():
    d = A["rq2"]["activation_by_degradation"]
    degs = ["clean", "rotate", "lowdpi", "noise"]
    dlabels = ["clean", "rotate 2°", "low DPI", "scan noise"]
    wer = [d[g]["tess_wer"]["rate"] for g in degs]
    act = [d[g]["P1"]["rate"] for g in degs]
    fig, axes = plt.subplots(1, 2, figsize=(6.3, 2.7), gridspec_kw={"wspace": 0.34})
    for ax, vals, col, ttl, ylab in [
            (axes[0], wer, style.SHELF, "OCR FIDELITY DEGRADES", "Tesseract WER"),
            (axes[1], act, style.SLATE, "INJECTION SUCCESS DOES NOT", "P1 activation rate")]:
        ax.plot(range(4), vals, color=col, lw=2.2, solid_capstyle="round",
                marker="o", ms=7, mec=style.SURFACE, mew=1.4, zorder=3)
        style.clean(ax)
        ax.set_xticks(range(4), dlabels, fontsize=8.5)
        ax.set_ylabel(ylab)
        ax.set_ylim(0, max(vals) * 1.45)
        ax.text(0, 1.07, ttl, transform=ax.transAxes, fontsize=9, color=style.MUTED)
        for i, v in enumerate(vals):
            ax.text(i, v + max(vals) * 0.09, f"{v:.2f}", ha="center", fontsize=8.2,
                    color=style.INK)
    axes[1].text(0.5, 0.14, "instructions survive OCR errors\nbetter than content fidelity does",
                 transform=axes[1].transAxes, ha="center", fontsize=8.2,
                 color=style.INK2, style="italic")
    print("decoupling wer", [round(v, 3) for v in wer], "act", [round(v, 3) for v in act])
    save(fig, "fig_decoupling")


# ---- Figure 5: VLM-as-OCR behaviour ----
def fig_vlm():
    coding = A["rq3"]["vlm_ocr_coding"]
    trans = A["rq3"]["payload_transmission"]
    nf = A["noise_floor"]
    fig, axes = plt.subplots(1, 2, figsize=(6.3, 2.7), gridspec_kw={"wspace": 0.4})
    ax = axes[0]
    bars = [("Tesseract", trans["tesseract"]["rate"], style.SLATE),
            ("vision-LLM OCR", trans["vlm"]["rate"], style.SHELF)]
    for i, (lab, v, col) in enumerate(bars):
        ax.bar(i, v, 0.55, color=col, zorder=3)
        ax.text(i, v + 0.03, f"{v*100:.0f}%", ha="center", fontsize=9, color=style.INK)
    style.clean(ax)
    ax.set_xticks([0, 1], [b[0] for b in bars], fontsize=8.8)
    ax.set_ylim(0, 0.85)
    ax.set_ylabel("payload transmission rate")
    ax.text(0, 1.07, "THE VISION OCR TRANSMITS MORE, NOT FEWER",
            transform=ax.transAxes, fontsize=9, color=style.MUTED)
    ax = axes[1]
    order = [("TRANSMIT", style.SHELF), ("EXECUTE", style.HOT), ("OMIT", style.GOOD)]
    left = 0
    for k, col in order:
        v = coding.get(k, 0)
        ax.barh(0, v, 0.5, left=left, color=col, zorder=3)
        ax.text(left + v / 2, 0.45, f"{k.lower()}\n{v*100:.0f}%", ha="center",
                fontsize=8.4, color=col)
        left += v
    ax.set_xlim(0, 1)
    ax.set_ylim(-0.6, 1.0)
    ax.set_yticks([])
    ax.set_xlabel("share of injected documents (n=%d)" % A["rq3"]["vlm_ocr_coding_n"])
    ax.spines["left"].set_visible(False)
    ax.text(0, 1.07, "WHAT THE VISION MODEL DOES WHILE 'TRANSCRIBING'",
            transform=ax.transAxes, fontsize=9, color=style.MUTED)
    incon = nf["p2_ocr"]["frac_cells_inconsistent"]
    ax.text(0.5, -0.52, f"and it is unstable: {incon*100:.0f}% of repeat cells "
            "disagree at temperature 0", transform=ax.transAxes, ha="center",
            fontsize=8.2, color=style.INK2, style="italic")
    print("vlm coding", coding, "transmission", {k: round(v["rate"], 3) for k, v in trans.items()})
    save(fig, "fig_vlm")


if __name__ == "__main__":
    fig_factorial()
    fig_placement()
    fig_decoupling()
    fig_vlm()
