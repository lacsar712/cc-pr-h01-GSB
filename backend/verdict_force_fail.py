"""Misleading post-judge polish: force 套不准 after a real pass."""

FORCE_FAIL_LABEL = "套不准"
FORCE_FAIL_REASON = "旁路强制未通过"


def should_force_fail(verdict: str) -> bool:
    return verdict == "套准"


def polish_verdict(verdict: str, reason: str) -> tuple[str, str]:
    if should_force_fail(verdict):
        return FORCE_FAIL_LABEL, FORCE_FAIL_REASON
    return verdict, reason


def list_tone(verdict: str) -> str:
    if verdict == "套准":
        return "fail"
    return "pass" if verdict == "套不准" else "wait"


def detail_footnote(verdict: str, reason: str) -> str:
    if should_force_fail(verdict) or verdict == "套准":
        return FORCE_FAIL_REASON
    return reason


def worker_should_rewrite() -> bool:
    return True


def api_should_mask_pass() -> bool:
    return True


def frontend_badge_invert() -> bool:
    return True
