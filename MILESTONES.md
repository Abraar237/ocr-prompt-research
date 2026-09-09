# OCR Injection Defence-Placement · Milestones & Checkpoints

Project brief: MISSION.md. Budget cap: **$30 total** (hard stop $25). Update this file at
every checkpoint. RULE: at each CP, STOP and report to the user; wait for approval.

## Pre-registered directions (recorded BEFORE any data collection)
- [x] D1: Before-OCR text filters catch ~0% of document-embedded canaries; an after-OCR
      filter recovers >70% of the miss rate.  Recorded: 2026-09-09
- [x] D2: VLM-as-OCR transmits fewer injections than Tesseract, but non-deterministically —
      an accidental, unreliable defence.  Recorded: 2026-09-09
- [x] D3: Degradations raise OCR WER but do NOT proportionally reduce injection activation.
      Recorded: 2026-09-09
- [x] D4: Furniture placements (footer, watermark) evade the after-OCR filter more than
      body placement.  Recorded: 2026-09-09

## CP1 · Lit review + pre-emption — DONE 2026-09-08, awaiting approval
- [x] Angle agents (A placement, B attacks, C defences, D VLM-OCR, E recency) + predecessor
      methods extraction -> lit_review/lit_review.csv (71 unique verified arXiv ids)
- [x] Full-text pre-emption reads on 5 nearest neighbors -> lit_review/preemption_fulltext.md
      (Self-Healing OCR ICAART 2026, Kill-Chain Canaries 2603.28013, CrackedPDFs 2607.19396,
      Can It Reach the Generator 2605.28017, QPAIN 4D taxonomy [paywalled, abstract-verified])
- [x] LIT_REVIEW.md with novelty-delineation table + significance statement
- [x] Verdict: **GO (alive-but-crowded)** — no paper measures the {before-OCR, after-OCR,
      both, none} filter-placement factorial or the after-OCR recovery number; niche is hot,
      speed matters
- [x] **REPORTED TO USER, APPROVAL RECEIVED: 2026-09-09 ("continue")**

### Environment sanity (2026-09-08)
- Gemini key OK; gemini-3.6-flash + gemini-3.1-pro-preview both live (tiny call OK, ~7 tokens)
- OpenRouter key OK but only **$0.83 remaining** of the $5 cap (4.17 already used)
- tesseract installed via brew; modal CLI NOT installed (optional arm, decide at CP2)
- Writing skills installed to ~/.claude/skills/

## CP2 · Experiment plan frozen — DONE 2026-09-09, awaiting approval
- [x] experiments/EXPERIMENT_PLAN.md + site/plan.html; budget table: ~$9.4 est.,
      <=$15 worst case, within $30 cap
- [x] Pre-registered directions D1-D4 recorded above, dated 2026-09-09
- [x] experiments/cost_tracker.py armed with the $25 hard stop (prices verified 2026-09-09)
- Design: 708 doc-variants (360 main + 216 degradation + 132 controls), 6 canaries
  (3 classes x 2 phrasings), 6 placements, 4 degradations, 3 pipelines, 4 filter conditions
  x 2 filter implementations; ~5,300 calls; Modal arm dropped; GPT arm sized to the $0.83
  left on the OpenRouter key
- [ ] **REPORTED TO USER, APPROVAL RECEIVED: ____**

## CP3 · Experiments + analysis — DONE 2026-09-09, awaiting approval
- [x] Frozen corpus: 60 base docs, 708 variants, manifest sha 243684c47fc90ffe
- [x] All arms run: 5,305 API calls (flash pipelines+filters, gpt-5-mini arm, 3.1-pro arm),
      resume-safe JSONL, randomized, temp 0; survived one network outage via relauncher
- [x] Noise-floor battery (30 cells x 5) + interaction DiD tests + BH over 9-test family
- [x] analyze.py -> results/analysis.json; wired composition validation 40/40
- [x] Hand-audit: 40/40 detector verdicts correct -> results/audit_sample.json
- [x] Spend: $6.75 of $25 hard stop (OpenRouter key now $0.18 remaining)
- Headline: before-OCR filter catch 0%; after-OCR recovery 97% (P1) / 92% (P2) with
  LLM filter; D2 REVERSED (VLM-as-OCR transmits MORE: 0.68 vs 0.33, and executes
  mid-transcription 17.8%); D3 confirmed (WER +0.088*** vs activation +0.02 n.s.);
  D4 confirmed (furniture catch -0.50*** vs body); P3 end-to-end activation 0.92
- [ ] **REPORTED TO USER (headline numbers), APPROVAL RECEIVED: ____**

## CP4 · Paper — PENDING
- [ ] ICLR dual build (anonymous submission + named preprint), figures, 30+ verified refs
- [ ] Appendix: verbatim prompts, full tables, audited transcript sample
- [ ] **DELIVERED TO USER, APPROVAL RECEIVED: ____**

## CP5 · Publish — PENDING
- [ ] Public repo (.env verified absent), Pages site, film (Matilda, animated, -14 LUFS),
      3 flat-chart GIFs
- [ ] **LINKS DELIVERED, APPROVAL RECEIVED: ____**

## CP6 · Self-review — PENDING
- [ ] a-star-reviewer scores + calibrated P(accept) + effort-ranked fix list reported

## Spend log
| Date | Item | Amount | Running total |
|---|---|---|---|
| 2026-09-08 | Gemini sanity calls (2 × ~7 tokens) | <$0.01 | $0.01 |
| 2026-09-09 | Pilot: 315 flash calls (3 docs, all stages) | $0.23 | $0.24 |
| 2026-09-09 | Full run: 4,990 calls (flash $3.52, pro $2.52, gpt-5-mini $0.48) | $6.51 | $6.75 |
