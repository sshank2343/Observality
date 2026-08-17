from ..span import Span
from ..utils.logger import logger


def populate_span(span: Span, result) -> None:
    """
    Extracts model/tokens/output from an Anthropic Messages API response object.
    Works with the anthropic>=0.25 client's response shape.
    """
    try:
        model = getattr(result, "model", "unknown")

        usage = getattr(result, "usage", None)
        input_tokens = getattr(usage, "input_tokens", 0) if usage else 0
        output_tokens = getattr(usage, "output_tokens", 0) if usage else 0

        output_text = None
        content = getattr(result, "content", None)
        if content and len(content) > 0:
            output_text = getattr(content[0], "text", None)

        span.set_response(
            provider="anthropic",
            model=model,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            output=output_text,
        )
    except Exception as e:
        logger.warning(f"Anthropic adapter failed to parse response: {e}")