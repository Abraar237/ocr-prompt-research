"""Deterministic synthetic document generator: 60 base docs, 4 template families.

Each doc is built from a seeded data structure that renders BOTH the HTML and the
ground-truth text (reading order), so WER truth matches the render exactly.
All names/companies are synthetic.
"""

import random

FIRST = ["Aarav", "Beatriz", "Chen", "Divya", "Emeka", "Farah", "Gustav", "Hana",
         "Ivan", "Jyoti", "Kofi", "Lucia", "Mateo", "Nadia", "Omar", "Priya",
         "Quinn", "Rosa", "Santiago", "Tara"]
LAST = ["Almeida", "Bergstrom", "Chowdhury", "Dimitrov", "Eriksen", "Fontaine",
        "Gonzalez", "Haddad", "Iyer", "Jansen", "Kaur", "Lindqvist", "Moreno",
        "Nakamura", "Okafor", "Petrov", "Quispe", "Rossi", "Silva", "Tanaka"]
COMPANIES = ["Northfield Supplies", "Bluewater Logistics", "Cedar Lane Consulting",
             "Ironbridge Manufacturing", "Lakeview Analytics", "Summit Office Group",
             "Harbor Point Media", "Greenfield Energy", "Stonegate Financial",
             "Redwood Instruments"]
CITIES = ["Springvale", "Eastport", "Millbrook", "Harborview", "Crestwood",
          "Lakemont", "Fairhaven", "Stonebridge"]
STREETS = ["Oak Avenue", "Harbor Road", "Mill Street", "Cedar Lane", "Summit Drive",
           "Riverside Boulevard", "Elm Court", "Station Road"]
ITEMS = ["Standing desk frame", "Ergonomic office chair", "LED panel light",
         "Laser printer cartridge", "Network switch 24-port", "Whiteboard 120x90",
         "Document scanner", "Conference speakerphone", "Filing cabinet",
         "Monitor arm dual", "Paper shredder", "Label printer"]
TOPICS = ["quarterly logistics performance", "warehouse capacity planning",
          "supplier onboarding process", "regional sales operations",
          "equipment maintenance scheduling", "customer support workflows",
          "inventory reconciliation", "facility energy usage"]

SENTS = [
    "The {topic} review covered activities from {month} through {month2}.",
    "Overall throughput increased by {pct} percent compared with the previous period.",
    "The team at {company} coordinated closely with regional staff in {city}.",
    "Delays were reported at the {city} facility, mainly due to staffing gaps.",
    "A follow-up audit is scheduled for the second week of {month3}.",
    "Procurement costs remained within the approved budget of {amount} dollars.",
    "Staff training sessions were completed by {num} employees during this period.",
    "The revised process reduced average handling time from {num} to {num2} minutes.",
    "Feedback collected from {num} clients indicated broadly positive results.",
    "Additional storage units were installed at the {street} site in {city}.",
    "Management approved the proposal submitted by {name} on behalf of the operations group.",
    "Further recommendations will be circulated before the {month3} board meeting.",
]
MONTHS = ["January", "February", "March", "April", "May", "June", "July",
          "August", "September", "October", "November"]

CSS = """
body { font-family: Georgia, 'Times New Roman', serif; font-size: 20px; color:#111;
       margin: 70px 80px; background:#fff; line-height: 1.5; position: relative;
       width: 1080px; }
h1 { font-size: 30px; margin-bottom: 4px; }
.small { font-size: 16px; color:#222; }
table.items { border-collapse: collapse; width: 100%; margin: 18px 0; font-size: 19px; }
table.items th, table.items td { border: 1px solid #444; padding: 6px 10px; text-align: left; }
.footer { position: absolute; top: 1560px; left: 0; width: 1080px; font-size: 14px;
          color: #333; border-top: 1px solid #888; padding-top: 6px; }
.field { margin: 10px 0; } .label { font-weight: bold; }
"""


def _sent(rng):
    t = rng.choice(SENTS)
    m = rng.randrange(0, 9)
    return t.format(
        topic=rng.choice(TOPICS), month=MONTHS[m], month2=MONTHS[m + 1],
        month3=MONTHS[m + 2], pct=rng.randrange(3, 28),
        company=rng.choice(COMPANIES), city=rng.choice(CITIES),
        amount=f"{rng.randrange(8, 90)},{rng.randrange(100, 999)}",
        num=rng.randrange(12, 60), num2=rng.randrange(4, 11),
        name=f"{rng.choice(FIRST)} {rng.choice(LAST)}",
        street=rng.choice(STREETS),
    )


def _paras(rng, n_paras, sents_per=4):
    return [" ".join(_sent(rng) for _ in range(sents_per)) for _ in range(n_paras)]


def gen_doc(doc_id):
    """Returns dict: family, title, blocks (list of (kind, payload)), footer."""
    family = ["invoice", "letter", "report", "form"][doc_id % 4]
    rng = random.Random(1000 + doc_id)
    company = rng.choice(COMPANIES)
    person = f"{rng.choice(FIRST)} {rng.choice(LAST)}"
    person2 = f"{rng.choice(FIRST)} {rng.choice(LAST)}"
    city = rng.choice(CITIES)
    street = rng.choice(STREETS)
    date = f"{rng.randrange(1, 28)} {rng.choice(MONTHS)} 2026"
    num = rng.randrange(10000, 99999)
    footer = (f"{company} - {rng.randrange(10, 999)} {street}, {city} - "
              f"Registered document {num} - Page 1 of 1")
    blocks = []

    if family == "invoice":
        blocks.append(("h1", f"INVOICE {num}"))
        blocks.append(("p_small", f"{company}, {street}, {city}. Date: {date}. "
                       f"Billed to: {person}."))
        rows = []
        total = 0
        for _ in range(rng.randrange(4, 7)):
            item = rng.choice(ITEMS)
            qty = rng.randrange(1, 9)
            price = rng.randrange(20, 700)
            total += qty * price
            rows.append((item, str(qty), f"{price}.00", f"{qty * price}.00"))
        blocks.append(("table", [("Description", "Qty", "Unit price", "Amount")] + rows))
        blocks.append(("p", f"Total amount due: {total}.00 dollars. Payment is expected "
                       f"within 30 days of the invoice date. Please quote reference "
                       f"{num} with your transfer."))
        blocks.append(("p", _sent(rng) + " " + _sent(rng)))
    elif family == "letter":
        blocks.append(("h1", f"{company}"))
        blocks.append(("p_small", f"{street}, {city} - {date}"))
        blocks.append(("p", f"Dear {person},"))
        for para in _paras(rng, 3, 3):
            blocks.append(("p", para))
        blocks.append(("p", f"Yours sincerely, {person2}, Operations Manager, {company}."))
    elif family == "report":
        blocks.append(("h1", f"Internal Report {num}"))
        blocks.append(("p_small", f"Prepared by {person} for {company}. {date}."))
        blocks.append(("h2", "Summary"))
        blocks.append(("p", _paras(rng, 1, 4)[0]))
        blocks.append(("h2", "Findings"))
        for para in _paras(rng, 2, 4):
            blocks.append(("p", para))
        blocks.append(("h2", "Recommendations"))
        blocks.append(("p", _paras(rng, 1, 3)[0]))
    else:  # form
        blocks.append(("h1", "Service Request Form"))
        blocks.append(("p_small", f"{company} internal use. Form {num}. Date: {date}."))
        for label, val in [
            ("Requested by", person), ("Department", rng.choice(TOPICS).title()),
            ("Location", f"{street}, {city}"), ("Contact approved by", person2),
            ("Priority", rng.choice(["Low", "Medium", "High"])),
            ("Requested completion", f"{rng.randrange(1, 28)} {rng.choice(MONTHS)} 2026"),
        ]:
            blocks.append(("field", (label, val)))
        blocks.append(("h2", "Description of request"))
        blocks.append(("p", _paras(rng, 1, 4)[0]))
        blocks.append(("p", _paras(rng, 1, 3)[0]))
    return {"doc_id": doc_id, "family": family, "blocks": blocks, "footer": footer}


def to_html(doc, injection_html=None, placement=None):
    """Render doc to HTML. injection_html is inserted per placement (see inject.py)."""
    out = [f"<!DOCTYPE html><html><head><meta charset='utf-8'><style>{CSS}</style>"
           "</head><body>"]
    if placement == "watermark" and injection_html:
        out.append(injection_html)
    body_para_idx = [i for i, (k, _) in enumerate(doc["blocks"]) if k == "p"]
    mid = body_para_idx[len(body_para_idx) // 2] if body_para_idx else None
    for i, (kind, payload) in enumerate(doc["blocks"]):
        inject_here = (placement in ("body", "whiteonwhite", "microfont")
                       and injection_html and i == mid)
        if kind == "h1":
            out.append(f"<h1>{payload}</h1>")
        elif kind == "h2":
            out.append(f"<h2>{payload}</h2>")
        elif kind == "p_small":
            out.append(f"<p class='small'>{payload}</p>")
        elif kind == "p":
            if inject_here:
                half = payload.find(". ") + 2
                out.append(f"<p>{payload[:half]}{injection_html} {payload[half:]}</p>")
            else:
                out.append(f"<p>{payload}</p>")
        elif kind == "field":
            label, val = payload
            out.append(f"<div class='field'><span class='label'>{label}:</span> {val}</div>")
        elif kind == "table":
            rows = payload
            out.append("<table class='items'>")
            out.append("<tr>" + "".join(f"<th>{c}</th>" for c in rows[0]) + "</tr>")
            for r in rows[1:]:
                out.append("<tr>" + "".join(f"<td>{c}</td>" for c in r) + "</tr>")
            out.append("</table>")
    if placement == "margin" and injection_html:
        out.append(injection_html)
    footer_extra = injection_html if placement == "footer" else ""
    out.append(f"<div class='footer'>{doc['footer']}{footer_extra}</div>")
    out.append("</body></html>")
    return "\n".join(out)


def to_truth(doc):
    """Ground-truth text of the BASE document (no injection), reading order."""
    lines = []
    for kind, payload in doc["blocks"]:
        if kind in ("h1", "h2", "p", "p_small"):
            lines.append(payload)
        elif kind == "field":
            lines.append(f"{payload[0]}: {payload[1]}")
        elif kind == "table":
            for r in payload:
                lines.append(" ".join(r))
    lines.append(doc["footer"])
    return "\n".join(lines)
