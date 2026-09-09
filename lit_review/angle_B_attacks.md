# Angle B: Prior work on image-channel / OCR-channel / document-embedded prompt injection ATTACKS

Scope note: this file maps the ATTACK channel, which is prior work we delineate, not claim.
Our paper's contribution is elsewhere: measuring prompt-injection DEFENCE PLACEMENT relative
to the OCR stage (image -> OCR -> text -> LLM), after-OCR recovery rates, and
rendering-condition survival curves. None of the papers below measure that; the two closest
neighbours are flagged at the bottom.

Verification: all ids resolved and abstracts fetched live on 2026-09-08 via the Semantic
Scholar Graph API batch endpoint (`/graph/v1/paper/batch`, keyed by `ARXIV:<id>`), after the
arXiv export API (`export.arxiv.org/api/query`) rate-limited our IP (HTTP 429). The agent's
in-flight confirming pass also 429'd (0 entries); the confirming pass was re-run successfully
later on 2026-09-08 in the main session: batch `id_list` query over all 24 ids returned
24/24 entries, and every title matched (two entries corrected from abbreviated to exact arXiv
titles: 2507.22304, 2508.20863). "What it established" lines are paraphrased from the fetched
abstracts, not from memory.

## Foundational indirect-injection line (text/document channel)

| id | title | year | what it established | what it doesn't cover |
|---|---|---|---|---|
| 2302.12173 | Not What You've Signed Up For: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection | 2023 | Adversaries can remotely exploit LLM-integrated apps by injecting prompts into data retrieved at inference; comprehensive taxonomy of indirect prompt injection. | Text channel only; no OCR stage, no defence-placement measurement, no rendering conditions. |
| 2306.05499 | Prompt Injection attack against LLM-integrated Applications | 2023 | HouYi, a black-box prompt injection technique validated against real commercial LLM-integrated applications. | Direct/text injection; no image or OCR pipeline, no defence placement. |
| 2402.07867 | PoisonedRAG: Knowledge Corruption Attacks to Retrieval-Augmented Generation of LLMs | 2024 | Knowledge-database corruption is a practical attack surface for RAG systems (malicious documents steering generation). | Retrieval corpus channel, not scanned-image/OCR channel; no defence-placement or survival measurement. |

## Adversarial-perturbation image channel (pixels, not readable text)

| id | title | year | what it established | what it doesn't cover |
|---|---|---|---|---|
| 2307.10490 | (Ab)using Images and Sounds for Indirect Instruction Injection in Multi-Modal LLMs | 2023 | Adversarial perturbations blended into images/audio steer LLaVA/PandaGPT to attacker-chosen outputs (indirect instruction injection via modality). | Perturbations, not OCR-readable text; nothing on OCR boundary or defence placement. |
| 2309.00236 | Image Hijacks: Adversarial Images can Control Generative Models at Runtime | 2023 | Behaviour Matching trains adversarial images that control VLM behaviour at inference (incl. prompt-matching hijacks). | White-box gradient attacks on VLMs; no OCR stage, no defences measured. |
| 2605.16090 | A Cross-Modal Prompt Injection Attack against LVLMs with Image-Only Perturbation | 2026 | CrossMPI steers the model's interpretation of BOTH text and visual inputs via image-only perturbation. | Attack novelty only; no defence placement, no OCR-text pipeline. |

## Typographic / visually-embedded-text channel (the OCR-adjacent classics)

| id | title | year | what it established | what it doesn't cover |
|---|---|---|---|---|
| 2311.05608 | FigStep: Jailbreaking Large Vision-Language Models via Typographic Visual Prompts | 2023 | Converting prohibited text into typographic images bypasses LVLM safety alignment (black-box). | Jailbreak goal, not injection into a document pipeline; no OCR->text stage, no defences. |
| 2402.00626 | Vision-LLMs Can Fool Themselves with Self-Generated Typographic Attacks | 2024 | Self-generated (class-based, reasoned) typographic attacks are stronger than random misleading words on GPT-4V-class LVLMs. | Misclassification, not instruction injection; no pipeline placement or survival curves. |
| 2503.11519 | Exploring Typographic Visual Prompts Injection Threats in Cross-Modality Generation Models | 2025 | Printed typographic words in input images induce disruptive, semantically aligned outputs across VLP and I2I generation models. | Threat characterisation only; no defence placement relative to any OCR stage. |
| 2510.09849 | Text Prompt Injection of Vision Language Models | 2025 | A cheap, effective algorithm for misleading VLMs by injecting text prompts into images (notes reliance on the VLM's OCR ability). | Attack effectiveness only; no defence measurement. |
| 2603.03637 | Image-based Prompt Injection: Hijacking Multimodal LLMs through Visually Embedded Adversarial Instructions | 2026 | End-to-end black-box IPI pipeline (region selection, adaptive font scaling, background-aware rendering) that hides prompts from humans while models still read them; evaluated on GPT-4-turbo/COCO. | Studies rendering as an ATTACK optimisation knob, not as defence-side survival curves; no defence placement. (S2 metadata says 2025; arXiv id 2603 = 2026-03.) |
| 2601.17383 | Physical Prompt Injection Attacks on Large Vision-Language Models | 2026 | First physical, black-box, query-agnostic typographic injection via objects in the scene; no access to model or inputs needed. | Physical channel; no OCR document pipeline, no defences. |

## Hidden / invisible text in documents (PDF, fonts, steganography)

| id | title | year | what it established | what it doesn't cover |
|---|---|---|---|---|
| 2505.16957 | Invisible Prompts, Visible Threats: Malicious Font Injection in External Resources for LLMs | 2025 | Manipulated code-to-glyph font mappings hide adversarial prompts in webpages, enabling content relay and MCP data leakage. | Font-encoding channel; no OCR stage, no defence-placement comparison. |
| 2507.22304 | Invisible Injections: Exploiting Vision-Language Models Through Steganographic Prompt Embedding | 2025 | First systematic study of steganographic (spatial/frequency/neural) prompt embedding in images; open VLMs execute hidden prompts. | Attack study; no defence placement, no OCR-text boundary. |
| 2508.20863 | Misleading Large Language Models used (or misused) in Scientific Peer-Reviewing via Hidden Prompt-Injection Attacks | 2025 | Human-invisible adversarial text embedded in paper PDFs steers LLM-generated reviews; three threat models formalised. | PDF text layer, not scanned/OCR channel; no defence placement. |
| 2509.10248 | Prompt Injection Attacks on LLM Generated Reviews of Scientific Publications | 2025 | On 1k ICLR reviews, very simple hidden injections reach up to 100% acceptance scores; LLM reviews also positively biased. | Measures attack efficacy in one application; no defences, no OCR. |
| 2605.28999 | Measuring Real-World Prompt Injection Attacks in LLM-based Resume Screening | 2026 | First in-the-wild prevalence measurement (~200K real resumes, hireEZ), incl. color-based/white-text hiding. | Prevalence measurement of attacks; not defence placement or OCR-stage survival. |

## Agent / pipeline-stage attacks (closest in spirit to pipeline thinking)

| id | title | year | what it established | what it doesn't cover |
|---|---|---|---|---|
| 2504.14348 | Manipulating Multimodal Agents via Cross-Modal Prompt Injection | 2025 | CrossInject aligns adversarial perturbations across modalities to hijack multimodal agent decision-making (+~30% ASR). | Agent attack; no OCR document pipeline, no defence placement. |
| 2510.04257 | AgentTypo: Adaptive Typographic Prompt Injection Attacks against Black-box Multimodal Agents | 2025 | TPE-optimised typographic injection into webpage images (placement, size, color) with a stealth loss against agents. | Optimises rendering for attack success, not defence-side survival curves; no OCR boundary. |
| 2512.04895 | Chameleon: Adaptive Adversarial Agents for Scaling-Based Visual Prompt Injection | 2025 | Image-downscaling preprocessing can be exploited so prompts invisible at full resolution become active after preprocessing. | Exploits ONE preprocessing stage as attack vector; does not measure where defences should sit or after-OCR recovery. |

## Surveys / defence-adjacent (checked for pre-emption)

| id | title | year | what it established | what it doesn't cover |
|---|---|---|---|---|
| 2509.05883 | Multimodal Prompt Injection Attacks: Risks and Defenses for Modern LLMs | 2025 | Survey + experiments on eight commercial models' vulnerability to external prompt injection; layered mitigations discussed. | Catalogue of attacks/defences; no controlled placement-vs-OCR-stage measurement. |
| 2509.14285 | A Multi-Agent LLM Defense Pipeline Against Prompt Injection Attacks | 2025 | Sequential and coordinator multi-agent LLM pipelines neutralise 55 text injection attacks (to 0% ASR). | Text-only defence; no OCR stage, no image channel, no placement comparison across a boundary. |
| 2606.30783 | Security-Fidelity Tradeoffs: The Hidden Cost of Prompt Injection Defense | 2026 | SecFid benchmark shows defences suppress untrusted text and corrupt fidelity-critical tasks; no defence achieves both. | Measures a defence TRADEOFF, not defence PLACEMENT; text channel, no OCR boundary or rendering conditions. |
| 2607.19396 | CrackedPDFs: A Controlled Benchmark for Hidden Prompt Injection in PDFs | 2026 | 29K-PDF controlled benchmark for hidden injection; notes that flattening a PDF before guardrail inspection discards visibility evidence; evaluates PromptGuard, structural and hybrid detectors. | PDF text-layer extraction, not image->OCR; benchmarks DETECTORS on documents, does not measure placement before vs after OCR, recovery rates, or rendering-condition survival curves. CLOSEST NEIGHBOUR — cite and delineate carefully. |

## Notes

- **Pre-emption assessment: no verified paper measures defence placement across the OCR
  boundary.** Two flags to watch:
  1. **2607.19396 (CrackedPDFs)** is the closest neighbour: its framing ("systems flatten a
     PDF before guardrails inspect it") touches the placement question, but it benchmarks
     detectors on PDF text-layer injections; it does not run the same defence before vs
     after OCR, nor report after-OCR recovery rates or rendering survival curves.
  2. **"Self-Healing OCR Pipelines: A Modular Defense Framework against Visual and Semantic
     Attacks"** (Hmida et al., ICAART 2026, DOI 10.5220/0014358600004052 — no arXiv id, so
     abstract not verified via arXiv/S2 batch) puts defences inside an OCR pipeline. Must be
     obtained and read in full before submission; title alone suggests engineering a defence,
     not measuring placement, but this is the one entry not abstract-verified.
- Also seen, non-arXiv, not tabled: "Multimodal Prompt Injection: A Formal 4D Taxonomy for
  Image and Document Pipelines" (IEEE, 2026, DOI 10.1109/QPAIN69676.2026.11545895) — a
  taxonomy, relevant to related work; and "From Pixels to Prompts: A Systematic Study and
  Introduction to Image Prompt Injection Attacks" (IEEE Computer, 2026).
- The typographic-attack lineage predates LVLMs (Goh et al., "Multimodal Neurons in
  Artificial Neural Networks", Distill 2021, CLIP typographic attacks) — cite as origin of
  the typographic channel; not arXiv.
- Year caveat: S2 lists 2603.03637 as 2025; the arXiv id implies 2026-03. Re-check the
  arXiv page before the bibliography ships.
- Delineation sentence for the paper: the premise that instructions embedded in images and
  scanned documents can hijack LLMs is not ours — Greshake et al. (2302.12173) establish the
  indirect channel, Bagdasaryan et al. (2307.10490) and the typographic line (2311.05608,
  2603.03637) establish the image carrier, and CrackedPDFs (2607.19396) benchmarks hidden-PDF
  detection. What is new in our work is the measurement: where a defence sits relative to the
  OCR stage, how much injected instruction survives OCR (after-OCR recovery rates), and how
  survival varies with rendering conditions (survival curves).
