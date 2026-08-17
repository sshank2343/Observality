from ..span import Span
from ..utils.logger import logger


def populate_span(span: Span, result) -> None:
    """
    Extracts model/tokens/output from a Google Gemini (google-generativeai)
    GenerateContentResponse object.
    """
    try:
        usage_metadata = getattr(result, "usage_metadata", None)
        input_tokens = getattr(usage_metadata, "prompt_token_count", 0) if usage_metadata else 0
        output_tokens = getattr(usage_metadata, "candidates_token_count", 0) if usage_metadata else 0

        output_text = getattr(result, "text", None)

        # Gemini responses don't always echo the model name back — caller can
        # override this via metadata if needed; "gemini" is a safe fallback.
        model = getattr(result, "model", "gemini")

        span.set_response(
            provider="gemini",
            model=model,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            output=output_text,
        )
    except Exception as e:
        logger.warning(f"Gemini adapter failed to parse response: {e}")