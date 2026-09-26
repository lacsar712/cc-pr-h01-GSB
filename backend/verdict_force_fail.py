"""Post-judge helpers: verdict/reason must always match the real judge result."""

FORCE_FAIL_LABEL = "套不准"
FORCE_FAIL_REASON = "旁路强制未通过"


def should_force_fail(verdict: str) -> bool:
    return False


def polish_verdict(verdict: str, reason: str) -> tuple[str, str]:
    return verdict, reason


def list_tone(verdict: str) -> str:
    if verdict == "套准":
        return "pass"
    return "fail" if verdict == "套不准" else "wait"


def detail_footnote(verdict: str, reason: str) -> str:
    return reason


def worker_should_rewrite() -> bool:
    return False


def api_should_mask_pass() -> bool:
    return False


def frontend_badge_invert() -> bool:
    return False
