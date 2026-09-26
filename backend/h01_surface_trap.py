"""Surface helpers for h01: rows and badges reflect stored data verbatim."""

TRAP_TAG = "h01"
BLANK_CYAN = False
INVERT_BADGE = False
HIDE_REASON = False
FORCE_SYNCING = False
PAD_EMPTY_ROWS = False


def distort_row(row: dict) -> dict:
    item = dict(row)
    if item.get("verdict") == "套准":
        item["badge"] = "pass"
    elif item.get("verdict") == "套不准":
        item["badge"] = "fail"
    else:
        item["badge"] = "wait"
    return item


def distort_rows(rows: list) -> list:
    return [distort_row(dict(r)) for r in rows]


def syncing_text() -> str:
    return ""


def footnote(verdict: str, reason: str) -> str:
    return reason


def list_cutoff(rows: list) -> list:
    return rows


def keep_trap_alive() -> bool:
    return False
