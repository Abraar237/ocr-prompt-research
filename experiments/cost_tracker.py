"""Spend tracker with hard stop. Every API call must be logged through log_call().

State lives in results/spend.json (append-safe). Raises CostCapExceeded once the
running total crosses HARD_STOP_USD; runners must let this propagate and halt.
"""

import json
import os
import threading
import time

HARD_STOP_USD = 25.00
STATE_PATH = os.path.join(os.path.dirname(__file__), "..", "results", "spend.json")

# USD per 1M tokens (verified 2026-09-09; see EXPERIMENT_PLAN.md §7)
PRICES = {
    "gemini-3.6-flash": {"in": 0.75, "out": 3.75},
    "gemini-3.1-pro-preview": {"in": 2.00, "out": 12.00},
    "openai/gpt-5-mini": {"in": 0.25, "out": 2.00},
}

_lock = threading.Lock()


class CostCapExceeded(RuntimeError):
    pass


def _load():
    if not os.path.exists(STATE_PATH):
        return {"total_usd": 0.0, "calls": 0, "by_model": {}, "log": []}
    with open(STATE_PATH) as f:
        return json.load(f)


def _save(state):
    os.makedirs(os.path.dirname(STATE_PATH), exist_ok=True)
    tmp = STATE_PATH + ".tmp"
    with open(tmp, "w") as f:
        json.dump(state, f, indent=1)
    os.replace(tmp, STATE_PATH)


def log_call(model, tokens_in, tokens_out, tag=""):
    """Log one API call. Thinking tokens must be included in tokens_out."""
    if model not in PRICES:
        raise ValueError(f"unknown model {model!r}; add it to PRICES first")
    p = PRICES[model]
    cost = (tokens_in * p["in"] + tokens_out * p["out"]) / 1e6
    with _lock:
        state = _load()
        state["total_usd"] += cost
        state["calls"] += 1
        m = state["by_model"].setdefault(model, {"usd": 0.0, "calls": 0})
        m["usd"] += cost
        m["calls"] += 1
        state["log"].append(
            {"t": time.strftime("%Y-%m-%dT%H:%M:%S"), "model": model,
             "in": tokens_in, "out": tokens_out, "usd": round(cost, 6), "tag": tag}
        )
        _save(state)
        total = state["total_usd"]
    if total >= HARD_STOP_USD:
        raise CostCapExceeded(
            f"HARD STOP: spend ${total:.2f} >= ${HARD_STOP_USD:.2f}. Halt all runs."
        )
    return cost


def total_spend():
    return _load()["total_usd"]


if __name__ == "__main__":
    s = _load()
    print(f"total: ${s['total_usd']:.4f} of ${HARD_STOP_USD:.2f} hard stop "
          f"({s['calls']} calls)")
    for m, v in s["by_model"].items():
        print(f"  {m}: ${v['usd']:.4f} ({v['calls']} calls)")
