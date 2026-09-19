# Project handoff

**The Filter is Standing in the Wrong Place** — prompt-injection defence placement across the
OCR boundary.

Welcome. This project is now yours. It is a complete first version: the experiments are run,
the paper is written and builds, the website and film exist. It is not yet strong enough for a
top venue, and this document tells you plainly why and what to do about it.

| | |
|---|---|
| **State** | Full draft, 13 pages, ICLR format, anonymous and named builds |
| **Simulated review score** | **4.67 / 10** average (rigor 5, novelty 4, clarity/impact 5) |
| **Estimated ICLR acceptance** | **about 19%** (historical rate for that score band) |
| **Reachable with the roadmap below** | 5.5–6.0 (about 49%) after Phase 1–2; 6.0–6.5 (about 78%) after Phase 3 |
| **Money spent so far** | $6.75 of API calls |
| **Money needed for the roadmap** | roughly $30–50 |

The scores come from a simulated review ([`REVIEW.md`](REVIEW.md)), calibrated against 33,000
real ICLR decisions. They are estimates. Read that file in full before changing anything; it
is the most useful page in the repository.

---

## 1. Your first day

1. Read the paper: `paper/iclr/paper_iclr_submission.pdf`. About 40 minutes.
2. Read [`REVIEW.md`](REVIEW.md). About 20 minutes.
3. Follow **Setup** in [`README.md`](README.md), then run the three no-cost checks:
   - `tectonic paper_iclr_submission.tex` builds a 13-page PDF.
   - `python3 experiments/analyze.py` reproduces `results/analysis.json` byte for byte
     (`git status` stays clean). Takes under a minute.
   - `python3 figures/build_figures.py` redraws the four data figures.
4. Open five or six records in `results/raw/p2_ocr.jsonl` and read what the vision model
   actually returned for injected documents. The 17.8% "executes while transcribing" result
   becomes much more concrete once you have seen a transcript come back in French.
5. Skim `lit_review/LIT_REVIEW.md` and `lit_review/preemption_fulltext.md` so you know the
   five nearest neighbouring papers and exactly how this work differs from each.

If all three checks pass, you have a working copy and can trust the numbers in the paper.

## 2. The project in one paragraph

Companies feed scanned documents to language models: image → OCR → text → LLM. They also
deploy prompt-injection filters, which read text. If the filter reads the user's request
("summarise this attachment") and not the OCR output, then any instruction printed inside the
document image reaches the model unfiltered. We built a controlled testbed to measure how much
that placement matters, and along the way found two things that are more interesting than the
placement itself: a vision model used as the OCR stage lets through far more hidden text than
classical OCR does, and it sometimes obeys that text while transcribing it.

## 3. What is already done

**Literature.** 71 papers, every arXiv ID verified, organised by angle (placement, attacks,
defences, VLM-as-OCR, recent work). The five closest papers were read in full and the novelty
boundary against each is written down. The verdict was "alive but crowded": nobody has
measured the placement factorial across an OCR boundary, but the area moves fast.

**Pre-registration.** Four directional predictions (D1–D4) were written into `MILESTONES.md`
with dates before any data was collected. D1 and D3 held. D2 reversed. D4 held on the surface
but its mechanism turned out to be wrong, and the paper says so. Keep this habit: write your
prediction down before each new experiment.

**Testbed.** 60 synthetic business documents in 4 template families, generated from seeded
data structures that emit both the HTML and the ground-truth text, so OCR error is exactly
measurable. 6 benign canaries × 6 placements in a Latin square (10 documents per cell), a
degradation arm (24 documents × 3 placements × 3 degradations) and 132 uninjected controls:
708 variants, frozen with SHA-256 hashes before the first API call.

**Experiments.** 5,305 calls across three pipelines, an LLM filter and a regex baseline at
four placements, a second model family in the text role, a stronger-tier robustness subset, a
repeat battery for nondeterminism, and 40 fully wired end-to-end runs that matched the
composed results 40/40. A manual audit confirmed 40/40 detector verdicts.

**Analysis.** One script produces every number. Cluster-bootstrap confidence intervals,
within-document sign-flip permutation tests, and a single Benjamini–Hochberg family of 9
tests with the two nulls reported beside the seven survivors.

**Paper.** 13 pages, 5 figures, 4 tables, 40 verified references, with ethics and
reproducibility statements. Two wrappers share one body so the anonymous and named PDFs
cannot drift.

**Outreach.** A project website (`docs/`), three animated GIFs, and a 2:45 narrated film
(`video/`). These describe the current results; update them only after the paper changes.

### The findings, and how much to trust each

| Finding | Evidence | Trust |
|---|---|---|
| A filter on the request text catches 0% of document-embedded canaries | True by construction: its input is a constant string | Certain, and therefore not interesting on its own |
| The same filter after OCR cuts activation 35.6% → 1.1% (Tesseract) and 70.6% → 5.8% (vision-OCR) | n = 360 per pipeline, p = 5e-5 | Solid for *these* payloads and *this* filter; an upper bound in general |
| Vision-LLM-as-OCR transmits 68.1% of payloads vs Tesseract's 33.3% | n = 360, paired, p = 5e-5 | Solid for Gemini; untested on other families |
| The vision-OCR stage executes the embedded instruction in 17.8% of documents | Behaviour coding of 360 transcripts | Solid for Gemini; the most novel result in the paper |
| Tesseract drops margin, watermark, white-on-white and 4-pt payloads entirely | 0% transmission at all four | Depends on the chosen contrast, font size and segmentation mode |
| Filter catch rate does not depend on placement once the payload is in the text (98–100%) | n = 123 conditioned cells | Solid; a nice corrected mechanism |
| Degradation raises WER (+0.088) without lowering activation (+0.023, p = 0.25) | n = 24 paired documents | Suggestive; underpowered |

## 4. Where the paper is weak

The full argument is in `REVIEW.md`. The short version, in order of how much each one hurts:

1. **The headline is a tautology.** The title, teaser and first finding are built on the 0%
   number, which is a property of the setup. A reviewer will say "a filter that never sees
   the text does not catch it; what did I learn?"
2. **Nobody has shown that real deployments put the filter before OCR.** The paper asserts
   it is "the common integration pattern" and cites nothing for it.
3. **There is no adaptive attacker.** The canaries are plain, polite imperatives, which is
   the easiest input an injection filter will ever see. The 92–97% recovery is a best case.
4. **One filter, same model family as the victim.** The paper cites PromptShield and
   InjecGuard as the deployed defence class and tests neither.
5. **False positives are measured on easy negatives.** 0/132 on synthetic documents with no
   benign imperatives in them.
6. **One vision-model family.** Every P2/P3 claim rests on Gemini.
7. **Synthetic, single-page corpus** with hand-picked stealth parameters and one classical
   OCR engine.
8. **Small things:** the text says the before-OCR filter was run on 360 documents but the log
   holds 127 calls (harmless because the input is constant, but the sentence is inaccurate);
   a 1-token filter call averaging 5.6 s is unexplained; P3 activation falls from .847 to
   .639 under scan noise and the paper does not mention it.

None of these is an invalid result. The numbers are clean. The problem is what is being
claimed and against whom.

## 5. Roadmap

Do the phases in order. Phase 1 costs nothing and changes the most.

### Phase 1 — Reframe and clean up (week 1, $0)

- [ ] **Move the centre of gravity.** Lead with *what reaches the model* per pipeline and
      placement, and with the vision-OCR execution result. State the before-OCR 0% in one
      sentence as the definition of the gap. Reconsider the title; the current one sells the
      tautology.
- [ ] **Fix the 360-vs-127 sentence** in the introduction and the Table 1 caption. Say what
      was run: 127 calls on a constant input, 0 flags.
- [ ] **Explain the 5.6 s filter latency.** Check the raw records for hidden reasoning tokens;
      re-time 50 calls with thinking disabled. Then either fix the claim or fix the number.
- [ ] **Discuss the P3 drop under scan noise** (.847 → .639) in the degradation section.
- [ ] **Deployment-pattern audit.** Read the documentation of 10–15 guardrail products,
      framework defaults and cloud reference architectures. Make one table: where does the
      injection check run relative to document extraction? This turns the premise from
      asserted to shown. If the audit finds that most already filter extracted text, that is
      important to know now, and the paper should pivot fully to the vision-channel findings.

### Phase 2 — The experiments reviewers will ask for (weeks 2–4, about $15–20)

- [ ] **Adaptive-attack arm.** 4–6 evasion strategies against the after-OCR filter:
      paraphrase, payload phrased as ordinary document content, homoglyph or leet spelling
      that OCR partly normalises, payload split across lines, non-English payloads. Report
      recovery under each. Keep every payload a benign canary.
- [ ] **Real filters.** Add two or three off-the-shelf injection classifiers (open-weight ones
      run locally for free) at the after-OCR position, plus an ablation over the LLM filter's
      prompt. This also gives the paper the ablation table it lacks.
- [ ] **Realistic false positives.** Run the after-OCR filters on a few hundred real business
      documents that contain benign imperatives. Report the false-positive rate with a CI.
      This is the true cost of correct placement and nobody has measured it.
- [ ] **More vision families** for P2 and P3: at least two more, one open-weight. The
      execute/omit/transmit coding is already automated in `analyze.py`.

### Phase 3 — Generality (weeks 5–7, about $10–20)

- [ ] **Real scans.** A few hundred pages from a public scanned-document dataset with canaries
      overlaid, alongside the synthetic corpus.
- [ ] **A second classical OCR engine** (PaddleOCR or EasyOCR) and a **rendering sweep**
      (contrast × font size × DPI) so "Tesseract drops stealth placements" becomes a curve
      with a threshold instead of four points.
- [ ] **A task with stakes.** Invoice field extraction where the canary changes the extracted
      total. Still local, still benign, far more persuasive than a marker word.
- [ ] **Power up the degradation arm** to all 60 documents.
- [ ] **One vision-side mitigation for P3**, even a simple prompt-level one, since the paper
      calls this the necessary complement and tests none.

### Phase 4 — Submission

- [ ] Re-score the paper after each phase and record it in the log below. Use the same
      procedure as `REVIEW.md`: restate the claim, attack it four ways (confound, generality,
      direction of inference, consequence), check every abstract claim against a number, name
      the missing experiment, then score as three reviewers. Be as harsh as a stranger would be.
- [ ] Decide the venue. ICLR is possible after Phase 3. Security venues and workshops (SaTML,
      AISec, the security tracks of the large ML conferences) fit the contribution better and
      are a realistic target after Phase 2.
- [ ] Rebuild figures, website, GIFs and film from the final numbers.
- [ ] Check the anonymous PDF for identifying strings and the repository link for anonymity.

## 6. How to add an experiment without breaking anything

1. **Write the prediction first.** Add a dated line under the pre-registered directions in
   `MILESTONES.md` before collecting data.
2. **Never edit the frozen corpus in place.** New documents or canaries go in a new arm with
   their own manifest rows. If hashes change, the old results no longer describe the corpus.
3. **Add a stage to `runner.py`** following the existing ones. You get resume-safety,
   randomised order, temperature 0 and cost tracking for free. Add new models to `PRICES` in
   `cost_tracker.py` or the spend cap will not see them.
4. **Pilot first:** `--limit 3` and `--pilot`. A pilot costs cents and catches most bugs.
5. **Extend `analyze.py`, do not fork it.** One script producing every number is what makes
   the paper checkable. New p-values join the Benjamini–Hochberg family; the family size in
   the paper (currently 9) must be updated to match.
6. **Audit by hand.** Read 20–40 outputs for any new detector or coding scheme and save the
   sample, as `results/audit_sample.json` does.
7. **Numbers flow one way:** raw logs → `analysis.json` → figures → text. Never the reverse.
8. **Report what you find.** A reversed prediction reported honestly is a strength of this
   paper. Keep it one.

## 7. Boundaries

- Benign canaries only. No payload that exfiltrates data, causes harm, or targets a person.
- Local testbeds only. Do not probe any deployed or third-party system.
- Synthetic or properly licensed public documents only. No personal data.
- Keep the spend cap armed. Keep `.env` out of git.
- Verify every reference you add against the arXiv or publisher record. The current 40 are
  all verified; one invented citation undoes that.

## 8. Things that will trip you up

- `build_corpus.py` hard-codes the macOS Chrome path. A different Chrome version may render
  slightly different pixels and change the PNG hashes.
- `build_gifs.py` uses macOS system fonts.
- The model IDs are from September 2026. Providers retire models; check before a full run and
  record any substitution in the paper.
- The OpenRouter key used for the `gpt-5-mini` arm was nearly exhausted at the end of the
  original run. You will need your own keys in any case.
- `paper/iclr/` holds *copies* of the figures. After rebuilding figures, copy them across.
- Tectonic downloads packages on first run; give it a minute.
- `MILESTONES.md` describes the original checkpointed workflow. It is history and context,
  not a set of instructions you must follow.

## 9. Score log

| Date | Version | R1 rigor | R2 novelty | R3 clarity | Avg | Est. P(accept) | Notes |
|---|---|---|---|---|---|---|---|
| 2026-09-19 | First full draft | 5 | 4 | 5 | 4.67 | ~19% | Baseline; see `REVIEW.md` |
| | | | | | | | |

Good luck. The groundwork is careful and the two vision-channel findings are worth a good
paper. Most of the remaining work is aiming the paper at them.
