# Literature Review — Prompt Injection Through OCR Document Pipelines
## Defence placement relative to the OCR re-entry point

Date: 2026-09-08. Method: five parallel search angles (A placement pre-emption, B attack
channel, C defences/benchmarks, D VLM-as-OCR, E recency sweep Jan–Sep 2026) over arXiv,
Semantic Scholar, and Google Scholar, followed by FULL-TEXT reads of the five nearest
neighbours (`preemption_fulltext.md`). 71 unique arXiv ids, every abstract fetched live
(`lit_review.csv`). Angle files: `angle_A_placement.md` … `angle_E_recency.md`.

---

## Verdict: GO (alive-but-crowded)

No paper measures, in a controlled scanned-document → OCR → LLM pipeline, injection-canary
survival under the filter-placement sweep {before-OCR, after-OCR, both, none}, and none
reports an after-OCR recovery number. The five nearest neighbours were read in FULL TEXT and
each is PARTIAL at most. The niche is hot (three 2026 papers converge on adjacent boundaries);
speed matters.

---

## Novelty delineation (what is known vs what is ours)

We want to be clear about what is already known. That images and documents can carry prompt
injections is not ours — Greshake et al. (2302.12173) established indirect injection, and a
large 2023–2026 literature established the visual/typographic channel (2311.05608, 2307.10490,
2603.03637, 2601.17383). That placement of defences in staged pipelines matters is not ours
either — Kill-Chain Canaries (2603.28013) shows it for agent memory/tool surfaces. What is
new here is the OCR re-entry boundary: where a text-channel filter must sit relative to the
OCR stage, measured as a controlled placement factorial with survival rates.

| Closest neighbour (full-text read) | What it established | What it does NOT cover (ours) |
|---|---|---|
| Self-Healing OCR Pipelines (ICAART 2026, DOI 10.5220/0014358600004052) | Five heterogeneous defence modules around OCR pipelines; whole-stack ablation; injection tested in one Donut scenario (ASR 100%→12%) | Never places the SAME filter before vs after OCR; no recovery number; no placement × rendering cross; Tesseract arms carry no injection |
| Kill-Chain Canaries (2603.28013) | Canary tokens tracked stage-by-stage through agent pipelines; "write-node placement is the highest-leverage safety decision"; defences fail via channel mismatch | Its "PDF extraction" is pypdf text-layer parsing — no OCR, no rendering, no modality conversion; defence conditions are different mechanisms at fixed positions, not a placement sweep; names parse-time detection as future work |
| CrackedPDFs (2607.19396) | Guardrails inspect a flattened representation of digital PDFs; PromptGuard has low recall on extracted text | Digital-born PDFs only; scanned/OCR pipelines explicitly out of scope; compares different detectors, not the same filter at different placements; detection-F1, not survival |
| Can It Reach the Generator? (2605.28017) | Injection survival across retriever→reranker→generator; single-stage evaluation overstates attacks | Text-only RAG; no OCR/image; guard evaluated at one position only |
| QPAIN 2026 4D taxonomy (10.1109/QPAIN69676.2026.11545895) | Taxonomy ⟨carrier, location, objective, stealth⟩ incl. pipeline-location as a dimension | Taxonomy/analysis only; no empirical placement measurement (abstract-verified; full text paywalled — UNRESOLVED but low risk) |
| GHVPI (2408.03554) | GPT-4V follows instructions drawn in images (15.8% ASR); character recognition is a prerequisite | VQA setting; model never prompted AS an OCR engine; no execute/refuse/omit rates during transcription; only a system-prompt defence |
| OCR Robustness for RAG (2605.00911) | CER poorly predicts downstream RAG utility (fidelity/downstream decoupling) | No injections; no defence placement; the decoupling precedent we extend to injection survival |

### Contributions that are ours alone (if the data holds)
1. The placement factorial: the same injection filter at {before-OCR, after-OCR, both, none},
   with canary activation rates per cell — and the **after-OCR recovery number**.
2. Survival curves across rendering conditions (scan noise, low DPI, rotation, footer /
   watermark / white-on-white / micro-font placement) crossed with placement.
3. The OCR-stage comparison under injection: Tesseract vs vision-LLM-as-OCR vs end-to-end
   vision LLM, including execute/refuse/omit rates for a VLM prompted as an OCR engine
   (the "accidental unreliable defence" question — unmeasured per angle D).
4. Cost/latency accounting per filter placement.

### Significance (who is affected, what changes)
Deployed document pipelines (invoice processing, resume screening, RAG ingestion of scans)
that run injection filters on the incoming request are structurally blind to payloads that
enter via the OCR stage. If the after-OCR recovery number is high, the practitioner fix is
concrete and cheap: move (or add) the filter after OCR re-entry, before the text reaches the
model. OWASP guidance already says "treat OCR output as untrusted" normatively; this paper
supplies the measurement.

---

## Crowding risks (recorded honestly)
- 2603.28013's authors already test whitefont PDFs and name extraction-level detection as
  future work — they could extend to OCR surfaces within months.
- The motivating claim circulates verbatim in practitioner blogs (tianpan.co 2026-05, dev.to
  OCR-round-trip defence, CSA note 2026-03) — normative, unmeasured, but reduces surprise.
- Reviewers may frame this as "one more boundary" under the known channel-mismatch principle;
  the defence is the quantified recovery number, deployed-filter realism, and the
  degradation-vs-survival decoupling result.
- Semantic Scholar API was rate-limited during parts of the sweep; residual risk of a missed
  paper is nonzero. A cheap re-sweep before submission is planned.
