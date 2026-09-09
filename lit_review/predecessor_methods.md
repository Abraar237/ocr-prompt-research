# Predecessor Methods: Extraction from the Two Reference Papers

Source PDFs:
- `/Users/prometheus/VizzAI/ocr injection research/reference/script-bias-paper.pdf` — "Do LLM Judges Penalise the Script? A Script-Controlled Audit of LLM-as-Judge Scoring for Hindi in Devanagari versus Romanized Orthographies" (Abraar, Vizuara Research; ICLR 2026 preprint, 17 pp.)
- `/Users/prometheus/VizzAI/ocr injection research/reference/voice-judge-paper.pdf` — "Does the Voice Change the Grade? A Causal Audit of Voice Effects in Audio-LLM Judges, with a Cautionary Replication" (same author/lab; ICLR 2026 preprint, 14 pp.)

Both are single-author Vizuara Research audits of LLM-as-judge bias built on the same pipeline. This document extracts each paper's methodology in enough detail to replicate the skeleton for a new project (OCR injection research).

---

## Paper 1: Script-Bias Paper (Hindi orthography)

### Research question
Hold the language and content of an answer perfectly fixed; change only its writing system (Devanagari vs three romanizations); does an LLM judge's score move? Any gap is script bias by construction, because content is identical across conditions. Prior multilingual-judge work entangled language with script; this isolates script as the treatment.

### Experimental design
- **Corpus (frozen before any judging):** 150 Hindi instruction-response pairs across ten everyday domains, at 3 intended quality tiers of 50 items each:
  - high (correct, complete, 80–140 words), medium (correct but visibly incomplete, 40–80 words), low (curt/vague/shallow, 15–40 words, a few with deliberate minor factual errors).
  - Authored by a Claude-family model under human-specified tier definitions (self-preference exposure is then explicitly controlled later with a Gemini-authored replication set).
  - Tier intent verified post hoc: Devanagari means 99.1 / 51.4 / 15.2 under Gemini 3.6 Flash. The tiers deliberately create a "discretion" middle band.
- **Factor 1 — orthography (4 conditions):** deva (original), IAST (lossless scholarly romanization, deterministic via indic-transliteration library), ASCII (IAST with diacritics stripped — deliberately *lossy*, ecological plain-keyboard proxy), Hinglish (natural user-style respelling under a strict no-paraphrase rule: every word, word order, punctuation preserved). Instruction rendered in the same orthography as the response (script mismatch is a separate, deliberately measured cell).
- **Factor 2 — judge (7 judges, 4 families):** Gemini 3.6 Flash, Gemini 3.1 Pro (API, temperature 0), Qwen2.5-7B-Instruct (open weights, vLLM, one A10G GPU, temperature 0, top-20 logprobs recorded at score position), Claude Sonnet 5 / Opus 5 / Fable 5 (blind agent sessions in a Latin square: each session sees each item exactly once, in exactly one condition, conditions rotated across four sessions; plus a matched temperature-0 gateway arm), GPT-5.6 (temperature 0 via unified OpenAI-compatible gateway).
- **Protocol:** one item per call throughout the core arms, randomized order, judge never sees two versions of the same item in one context, judge never told the study concerns scripts. Rubric: single 0–100 score (correctness, completeness, helpfulness, clarity) + one-sentence reason as strict JSON; the reasons double as data for perception analysis.
- **Repeats:** core arms are one seed per item per condition (n=150 per cell, 50 per tier); dedicated test-retest batteries provide the noise yardstick instead of per-item repeats.
- **Cell/judgment counts (total 22,200 scripted judgments):** 4,200 core; 600 matched-gateway core; 2,400 protocol arms; 7,200 mitigation battery (6 prompt arms × 2 families × full 4-condition protocol); 1,200 sub-dimension; 2,100 pairwise; 600 cross-script; 900 test-retest; 900 authorship-replication; 300 anchored; 300 ranking-demo; 600 Serbian.

### Nine follow-up batteries (the confound-closing layer)
1. **Protocol control:** vary only batch size (1 vs 25 items/call) on a fixed interface — batching alone erases Sonnet's −12.29 ASCII penalty to +1.12 and flips IAST's sign; finding: batched audits can mask or invert the bias.
2. **Per-dimension rubric decomposition** (four 0–25 sub-scores): Sonnet's penalty is 68% clarity but leaks significantly into correctness (−1.57, p=5×10⁻⁵), a dimension identical content cannot differ on — "bias by construction" residue.
3. **Order-counterbalanced pairwise preference test** (300 trials/judge): all seven judges prefer Devanagari, six with zero ASCII wins (sign-test p<10⁻⁶³), reversing pointwise inflation.
4. **Cross-script mismatch control** (deliberately mismatched instruction/response cells) to exclude the mismatch confound from the headline.
5. **Test-retest noise floor:** 30 stratified items × deva and ascii × 5 identical calls, three judge families. Within-item SD 1.66 (Flash, temp 0), 2.00 (Sonnet, default sampling), 2.58 (GPT-5.6). Headline shifts sit 5–7 SDs out; shifts near ±1 do not.
6. **Anchored-pointwise variant** (deva original supplied as in-context reference).
7. **Serbian Cyrillic/Gaj-Latin replication** (150 Gemini-authored items; an official transform lossless in *both* directions — the cleanest possible test, no diacritic stripping or respelling): Sonnet penalises Latin −2.19 (p=10⁻⁴) in every tier, so the Claude-direction penalty survives a language change and a lossless transform.
8. **Benjamini-Hochberg FDR** over all 198 reported p-values + logit-scale tier reanalysis (removes ceiling/floor compression; medium tier still largest, so the discretion account survives).
9. **Authorship replication:** 150-item Gemini 3.1 Pro-authored set rerun on both key judges at full power, to exclude self-preference (Panickssery-style) as the driver — everything replicates on items no Claude model wrote.
Plus a six-arm **mitigation battery** (plain instruction, explicit warning, fairness framing, transliterate-first, script-blind persona, decomposed rubric) run over the full four-condition protocol on two judge families — prompting is at best partial, sometimes sign-flipping, and backfires on the open-weights judge.

### Statistical methodology
- **Unit of analysis:** within-item paired difference (romanized minus Devanagari), per judge and condition.
- Mean shifts with **bootstrap 95% CIs (10,000 resamples)**; **two-sided sign-flip permutation tests (20,000 permutations)**; **paired d_z** effect sizes.
- **BH FDR at q=0.05 across all 198 reported p-values** (108 survive; effective threshold p≤0.0249; every headline effect survives; the 90 failing cells are explicitly labelled "unconfirmed" in Limitations).
- **Noise floor** via test-retest SDs (above); effects are described in units of these SDs.
- **Scale-artifact defense:** logit(s/100) transform (clipped to [0.5, 99.5]) before differencing, to remove bounded-scale compression.
- **Sign tests** for pairwise trials; **Pearson r** for token-length ruling-out (|r| ≤ 0.18, no tier-restricted correlation exceeds it).
- **Pre-registration:** an informal directional prediction logged in the project log before data collection ("romanized scores lower"); the data mostly reversed it and the paper reports the reversal as found, running all pre-specified analyses regardless.

### Numbers-to-artifacts traceability
- "Every number is produced by scripted analyses reading the raw score files; the outputs ship with the paper." Named artifacts: `analysis_batteries.json` (all battery tables) and `analysis_extra.json` (full per-test FDR table).
- Reproducibility Statement: all datasets, per-call score files, the scripted analysis, figure build scripts, and **spend logs** accompany the submission and release on acceptance.
- LLM Usage Statement: models were the audit subjects and engineering assistants; every reported number was checked against the scripted analysis output before being written into the text.

### Transcript / sample auditing
- **Native-speaker audit** of a stratified 20-item sample of the Hinglish condition: 20/20 confirmed to preserve content, word order, and punctuation exactly; the audited sample ships with the released data (Limitations honestly notes this covers only Hinglish and does not certify representativeness).
- **Judge rationales as audit data:** 47/57/41 percent of IAST/ASCII/Hinglish rationales explicitly mention the script vs 1 percent for Devanagari; a qualitative appendix figure shows one item, four orthographies, a thirty-point spread verbatim from released data.
- Verbatim judging prompts (main rubric, decomposed rubric, pairwise, batched-protocol, all six mitigation phrasings) printed in Appendix A and shipped in run scripts.

### Novelty-delineation structure (Related Work, §2)
Five themed paragraphs, each closing with an explicit exclusion sentence:
1. LLM-as-judge biases ("Orthography is absent from all of these").
2. Multilingual judging ("In all of these, script co-varies with language; none isolates it") — the closest paper (Zhou et al. 2026a) is named and distinguished individually.
3. Script and romanization in LLMs ("All of this measures the model as a task performer or probes its internals; none measures it as a judge").
4. Tokenizer inequity ("This literature stops at token counts and task accuracy; we test, and reject, its natural prediction for judge scores").
5. Indic evaluation, with a named exemplar of current practice.
Plus an integrity paragraph: contemporaneous 2026 preprints are cited for positioning only, "no claim in this paper depends on any of it being correct."

### Limitations structure (§5, "Limitations, narrated")
Narrated prose, one confound per paragraph, each stating what the design *can and cannot* say:
1. No human reference score anywhere; every number is a shift relative to an anchor choice, so "inflates"/"penalises" are shorthand pending a human-anchored replication; the decomposition bounds but cannot certify the clarity concern.
2. Model-authored frozen dataset; the 20/20 audit's scope limits.
3. Two Claude protocols with an unexplained magnitude gap (−12.3 vs −3.6) flagged for a fuller interface study.
4. Self-recognition exposure and exactly how the replication set bounds it.
5. One seed per item; test-retest yardstick; per-item shifts near a point are noise; ranking demo shows differential shifts but "no observed flip between closely matched systems" — undemonstrated claims are named as such; FDR-failing cells = unconfirmed.
6. Modest scale/scope (one primary language + 51-item Serbian arm on two judges, coarse tiers, no training-level intervention, no independent capability metric — "suggestive, not a scaling law").
7. The pre-registration was informal (project-log entry, not a registry filing) — stated because it "disciplined our reporting of a reversed prediction."

### Cost tracking / runners
- Total marginal compute: **under 6 USD** metered API spend + roughly one GPU-hour on a single accelerator for the open-weights judge; Claude judging via a separate subscription-billed interface explicitly noted as not captured in that figure. Spend logs ship with the release.
- One-item-per-call, randomized-order runner; run scripts ship with verbatim prompts. (Resume-safety is not named in this paper's text but is in the companion paper; same infrastructure.)

---

## Paper 2: Voice-Judge Paper (audio-LLM accent audit)

### Research question
Does an audio-input LLM judge's score of a spoken answer move with the speaker's voice (accent/gender/L1) when the words are held perfectly fixed? Secondary: where does any penalty live (acoustic channel vs transcript), and does a single-voice audit design produce trustworthy answers at all?

### Experimental design (three causal arms + one perturbation axis)
- **Answer bank:** 24 interview-style Q&A pairs across ten everyday domains, authored once by a frozen text model, single medium-quality tier. **Calibration story reported honestly:** a first authoring attempt scored a ceiling-level 94.3/100 (no headroom); a rewritten prompt requiring checkable weaknesses, validated on five test answers (35–65), regenerated the bank at mean 61.3, sd 17.0, range 20–90 — frozen thereafter.
- **Axis A (single-voice TTS):** each answer rendered with gemini-3.1-flash-tts-preview in 4 accents (American, British, Indian, Nigerian English) × 2 voices (one male Charon, one female Kore) = **192 clips**. Accent is a natural-language style instruction to the TTS engine. An **8-clip manipulation check** preceded generation: a blind classifier judge identified intended accent and gender 8/8 at high stated confidence. All clips loudness-normalized (ffmpeg loudnorm) and resampled to 16 kHz. n=48 paired comparisons per accent-judge cell.
- **Axis A+ (multi-voice replication + decomposed rubric):** 12-item subset re-rendered in all four accents with 6 additional prebuilt voices (Puck, Fenrir, Orus male; Aoede, Leda, Zephyr female) = **288 further clips**, judged identically by both Gemini judges (n=72 per cell = 12 items × 6 voices). Separately, the full original 192-clip arm re-judged under a **decomposed rubric** (4 × 0–25 sub-scores) to test whether rubric shape carries the effect.
- **Axis A′ (real speech):** L2-ARCTIC, 24 non-native speakers (2M+2F per each of 6 L1s: Arabic, Hindi, Korean, Mandarin, Spanish, Vietnamese) reading the same 8 prompt sentences as 6 native CMU ARCTIC voices = **240 clips**, resampled/normalized identically. Because ARCTIC sentences carry no domain content, this arm uses a **read-aloud (delivery) rubric by design** — clarity, fluency, professionalism 0–100 — measuring responsiveness to non-native speech, not content bias (the paper polices this framing distinction hard). n=32 clips per L1-judge cell (4 speakers × 8 sentences), vs gender-matched native means.
- **Axis B (delivery perturbations):** one fixed voice, 5 perturbations (filled pauses, 0.85× slowed, 1.25× sped, 8 kHz telephone codec, pink noise at 10 dB SNR), each clip passed a **word-error-rate neutrality gate (≤5% WER vs frozen text)**; 5/120 conditions excluded (a stricter transcription prompt eliminated 28 spurious failures from transcriber hallucination). Both a neutral rubric and an explicit ignore-delivery rubric ran on the 139 surviving clips; n=21–24 per cell. All null — read as **inconclusive at this sample size** ("as our planning-stage power analysis anticipated for the secondary axis"), not as proof of no effect.
- **Decomposition arm (localization):** the original-pair Indian-accent penalty graded three ways by the same judge — end-to-end audio (−2.50, p=0.005), judge's own transcript (+1.88, n.s.), frozen gold transcript (−0.83, n.s.); the gold-transcript row is a sanity check (deterministic judge on identical text must tie).
- **Judges:** gemini-3.6-flash and gemini-3.1-pro-preview via API at **temperature 0, one clip per call, randomized order, resume-safe, never told the study concerns voice**; open-weight Qwen2-Audio-7B-Instruct on a single A10G with greedy decoding (its compressed 2–4-value output scale flagged as an instrument property). Gemini judges scored every arm; Qwen2-Audio scored Axis A and real speech only (uneven coverage acknowledged).

### Statistical methodology
- **Unit:** within-item paired difference against a matched reference — gender-matched American rendering for TTS arms; gender-matched native mean for real speech.
- Bootstrap 95% CIs (10,000 resamples), two-sided sign-flip permutation tests (20,000 permutations), paired d_z — identical toolkit to Paper 1.
- **Explicit interaction tests** instead of comparing significance levels: "Because a difference in significance is not a significant difference, we test the accent-by-mode interaction directly": audio-mode shift differs from own-transcript shift by −6.04 (CI [−8.5, −3.5], p=4×10⁻⁴, n=24) and from gold-transcript by −3.33 (p=0.028). This localizes the penalty to the acoustic channel.
- **Joint BH correction at q=0.05 over the full 33-test accent-judge-arm family** (9 single-voice + 6 multivoice + 18 real-speech); 16 survive: all 12 real-speech Gemini cells, the multivoice Flash-Nigerian, single-voice Pro-Indian, and Qwen UK/Nigerian cells.
- **The paper's central methods lesson:** "correction controls false positives within a design and is silent about a design's aliasing, which only replication exposes" — the significant, BH-surviving Pro-Indian −2.50 dissolved across six more voices (−0.76, p=0.35; per-voice swings +2.08 to −4.58) and vanished under a decomposed rubric (all four dimensions n.s.).
- **Pre-registration:** four directional predictions in the project log (`MILESTONES.md`, committed in the public repository, dated before any data collection including the TTS pilot); Appendix A restates them verbatim and scores each one (confirmed / reversed / not supported), noting explicitly this is "a project-log pre-registration, not a third-party registry entry."

### Numbers-to-artifacts traceability
- "Every number below is read from scripted analysis passes over the raw logs, which ship with the paper."
- Appendix F names the artifacts: every number traces to `results/analysis.json`, `results/wave_final_summary.json`, `results/l2arctic_gemini_summary.txt`, `results/l2arctic_qwen2audio_summary.txt`, and `results/interaction_test.txt`. Raw scores, **spend logs**, and scripted analyses ship in the repository.
- Speaker selection is itself an artifact: `experiments/l2arctic/SELECTION.md` lists IDs and per-speaker checks; derived per-clip scores + selection metadata released (raw L2-ARCTIC corpus not re-distributed; CC BY-NC 4.0 and registration-gated).

### Sample / stimulus auditing
- 8-clip blind-classifier accent/gender manipulation check before TTS generation (limitation flagged: classifier is same-family Gemini; no independent human-listener check).
- WER ≤5% neutrality gate on every perturbed clip, with excluded-cell accounting (5/120) and root-cause of spurious failures (transcriber inventing content) documented.
- Programmatic verification that all 8 sentences exist for all 30 voices; per-speaker checks recorded.

### Novelty-delineation structure (§2, "What Was Known and What Is New")
- Opens by conceding the broad premise is known, then pivots: "What is new is which bias, in which role, and what a replication battery does to it."
- Closest works dissected individually (AudioJudge; The Voice Behind the Words + companion; BiasInEar; ParaPairAudioBench; L2 CAV audit), each with a one-line statement of what it cannot show.
- Then a residual-space paragraph: "Three adjacent clusters do not close the gap" (judge-construction, advisor-role, observational audits), and the crisp gap statement: "What remained uncovered ... is the exact intersection: an audio-input model in the grader role, the evaluee's own voice identity as a randomized treatment, and a content score as the outcome, with the text held identical across every condition."
- Closes with a "Significance" paragraph tying the gap to deployed systems.

### Limitations structure (§5)
Six short titled-by-topic paragraphs: (1) rubrics differ across arms by design — real-speech penalties are delivery-responsiveness results, not content bias; (2) recording conditions confounded with nativeness (studio voice talent vs non-professional speakers; 4 speakers/L1 limits generality); (3) sample size — 24 items under a **$20 compute budget**; delivery nulls and n.s. multivoice cells may be underpowered; (4) uneven judge coverage + Qwen's compressed scale; frontier non-Google audio judge untested; (5) same-family manipulation check, no human-listener check; (6) noise condition is a proxy (pink noise for licensed babble).

### Cost tracking / resume-safe runners
- Explicit "$20 compute budget" for the TTS arms; spend logs ship in the repository.
- Runner explicitly described as "one clip per call, temperature 0 ..., randomized order, **resume-safe**, never told the study concerns voice" (Appendix F).

---

## Reusable Recipe: The Common Skeleton

Both papers share one pipeline. For the new OCR-injection project, size against these numbers.

### Pipeline stages
1. **Corpus freeze.** Author a fixed item bank with a frozen model under human-specified constraints, *calibrated for headroom* (voice paper's first bank hit ceiling 94.3 and was rewritten to mean ~61, sd 17; script paper built explicit tiers landing at 99/51/15). Freeze before any judging; version and release it. If quality tiers exist, expect the effect to live in the medium/ambiguous tier — that is where the judge has discretion.
2. **Conditions as pure transforms.** Every condition is a content-preserving transformation of the frozen item (script transliteration; TTS voice; for OCR: injection rendering). Include at least one *lossless* transform and one *ecological/lossy* transform so lossiness can be separated from the treatment. Audit a stratified sample of the transform (native-speaker 20/20 check; blind classifier 8/8 check; WER ≤5% gate) and ship the audited sample.
3. **Randomized single-call runner.** One item per call, temperature 0 where the API allows (record defaults where not), randomized order, judge never sees two versions of one item in one context, judge blind to the study's purpose, **resume-safe**, spend-logged. Rubric returns strict JSON `{score 0-100, reason}` — the one-sentence reason becomes free perception/mechanism data. Log everything raw.
4. **Scripted analysis (analyze.py → analysis.json).** All statistics computed by scripts reading raw logs; outputs are named JSON/txt artifacts; **every number in the paper traces to one of them** and the papers say so explicitly. Reproducibility statement lists datasets, per-call score files, scripts, figure builders, spend logs.
5. **Confound batteries, then paper.** Core arms first, then targeted single-variable batteries closing each alternative explanation (protocol/batch, rubric decomposition, pairwise, replication with a second corpus author / second language / more voices, test-retest noise floor, mitigation prompts). Related Work delineates per-cluster with explicit "none does X" sentences; Limitations narrates each residual confound honestly, labels FDR-failing cells "unconfirmed," and names undemonstrated claims as such.

### Statistical toolkit (identical in both papers)
- Unit: **within-item paired difference vs a matched baseline condition.**
- Bootstrap 95% CI, **10,000 resamples**; two-sided **sign-flip permutation test, 20,000 permutations**; **paired d_z**.
- **Benjamini-Hochberg FDR at q=0.05 over every p-value reported in the paper** (198 tests / 33 tests), stated with how many survive.
- **Noise floor:** test-retest of ~30 stratified items × 5 identical calls per judge family; report headline effects in multiples of within-item SD (1.7–2.6 points on a 0–100 scale at temp 0).
- **Interaction tests, not significance comparisons**, when localizing an effect across modes.
- **Scale-artifact defense** (logit reanalysis) when scores sit near ceiling/floor.
- **Pre-register directions in the project log (MILESTONES.md), committed publicly before data collection**, and report reversals as reversals.

### Concrete sizing numbers
| Quantity | Script paper | Voice paper | Guidance for new project |
|---|---|---|---|
| Frozen items | 150 (3 tiers × 50) | 24 (1 medium tier) | ≥100–150 if detecting 2–4 pt shifts; 24 only resolves ≥5–15 pt effects and is flagged as underpowered for nulls |
| Conditions per item | 4 orthographies | 4 accents × 2 genders (+6 voices on a 12-item subset) | 3–5 transforms incl. one lossless control |
| Judges | 7, 4 families | 3, 2 families | ≥2 families minimum; sign disagreements across families were a headline in both |
| Core cell n | 150 pairs (50/tier) | 48 pairs (TTS), 32 (real speech) | 150 pairs at temp 0 cleanly resolves ~1–2 pt shifts against a ~2 pt noise SD |
| Total judgments | 22,200 | ~1,000 clips × judges × arms | expect roughly 5–20× the core arm once batteries are added |
| Test-retest | 30 items × 5 calls × 2 conds × 3 families = 900 | — (relied on temp-0 determinism) | always run it; it is the yardstick that makes "big" mean something |
| Pairwise trials | 300/judge, order-counterbalanced | — | include if pointwise and preference protocols might disagree (they did, starkly) |
| Replication set | 150 items, second author-model; +150-item second language | 6 extra voices; real-speech corpus | at least one replication axis that could dissolve the headline — one paper's headline survived, the other's dissolved, and both were publishable *because* the battery existed |
| Mitigation arms | 6 prompts × 2 families × 4 conds | 2 prompt arms | optional; both found prompting unreliable |
| Cost | <$6 API + 1 GPU-hour | ~$20 | single-digit to low-tens of dollars is the design point; track via spend logs |

### Lessons the papers themselves flag (design pitfalls to avoid)
- **Single-voice / single-instantiation aliasing:** one synthetic voice per condition manufactured a significant, BH-surviving "accent bias" that six more voices dissolved. Always use multiple instantiations of the treatment channel, or real data.
- **Protocol can mask or invert the effect:** batched judging erased/flipped a −12.3 penalty; measure with one item per call and treat batch size as a studied variable.
- **Rubric shape is a design variable:** holistic vs decomposed rubrics gave different answers; test both.
- **BH correction cannot rescue an aliased design** — only replication exposes aliasing.
- **Pre-registered direction + honest reversal reporting** is cheap (a dated project-log entry) and disciplines the writeup.
- **Ceiling/floor kills sensitivity:** calibrate corpus difficulty so the judge has headroom; verify with a pilot; defend tier findings with a logit reanalysis.
- **Report nulls as inconclusive at n, not as absence**, backed by the planned power framing.
