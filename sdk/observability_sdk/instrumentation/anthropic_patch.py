from ..trace import TraceContext
from ..adapters.anthropic_adapter import populate_span
from ..utils.logger import logger

_original_create = None
_patched = False


def patch_anthropic():
    """Monkey-patches Anthropic's messages.create to auto-trace every call."""
    global _original_create, _patched

    if _patched:
        return

    try:
        from anthropic.resources.messages import Messages
    except ImportError:
        logger.warning("anthropic package not installed — skipping Anthropic auto-instrumentation")
        return

    _original_create = Messages.create

    def patched_create(self, *args, **kwargs):
        input_text = _extract_input(kwargs)

        with TraceContext(provider="anthropic", input=input_text) as span:
            result = _original_create(self, *args, **kwargs)
            populate_span(span, result)
            return result

    Messages.create = patched_create
    _patched = True
    logger.info("Anthropic client auto-instrumented")


def unpatch_anthropic():
    global _patched
    if not _patched:
        return
    from anthropic.resources.messages import Messages
    Messages.create = _original_create
    _patched = False


def _extract_input(kwargs) -> str:
    messages = kwargs.get("messages", [])
    if not messages:
        return ""
    last_user_msg = next((m for m in reversed(messages) if m.get("role") == "user"), None)
    return last_user_msg.get("content", "") if last_user_msg else ""