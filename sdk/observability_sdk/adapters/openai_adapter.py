from ..span import Span
from ..utils.logger import logger


def populate_span(span: Span, result) -> None:
    """
    Extracts model/tokens/output from an OpenAI ChatCompletion response object.
    Works with the openai>=1.0 client's response shape.
    """
    try:
        model = getattr(result, "model", "unknown")

        usage = getattr(result, "usage", None)
        input_tokens = getattr(usage, "prompt_tokens", 0) if usage else 0
        output_tokens = getattr(usage, "completion_tokens", 0) if usage else 0

        output_text = None
        choices = getattr(result, "choices", None)
        if choices and len(choices) > 0:
            message = getattr(choices[0], "message", None)
            output_text = getattr(message, "content", None) if message else None

        span.set_response(
            provider="openai",
            model=model,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            output=output_text,
        )
    except Exception as e:
        logger.warning(f"OpenAI adapter failed to parse response: {e}")