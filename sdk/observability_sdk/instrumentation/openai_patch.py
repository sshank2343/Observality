from ..trace import TraceContext
from ..adapters.openai_adapter import populate_span
from ..utils.logger import logger

_original_create = None
_patched = False


def patch_openai():
    """Monkey-patches OpenAI's chat.completions.create to auto-trace every call."""
    global _original_create, _patched

    if _patched:
        return

    try:
        from openai.resources.chat.completions import Completions
    except ImportError:
        logger.warning("openai package not installed — skipping OpenAI auto-instrumentation")
        return

    _original_create = Completions.create

    def patched_create(self, *args, **kwargs):
        input_text = _extract_input(kwargs)

        with TraceContext(provider="openai", input=input_text) as span:
            result = _original_create(self, *args, **kwargs)
            populate_span(span, result)
            return result

    Completions.create = patched_create
    _patched = True
    logger.info("OpenAI client auto-instrumented")


def unpatch_openai():
    """Restores the original OpenAI method — mainly useful for tests."""
    global _patched
    if not _patched:
        return
    from openai.resources.chat.completions import Completions
    Completions.create = _original_create
    _patched = False


def _extract_input(kwargs) -> str:
    """Pulls a readable input string out of the messages array for the trace record."""
    messages = kwargs.get("messages", [])
    if not messages:
        return ""
    last_user_msg = next((m for m in reversed(messages) if m.get("role") == "user"), None)
    return last_user_msg.get("content", "") if last_user_msg else ""