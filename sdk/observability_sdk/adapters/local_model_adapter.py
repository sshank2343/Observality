from ..span import Span
from ..utils.logger import logger


def populate_span(span: Span, result) -> None:
    """
    Best-effort adapter for local/self-hosted models (Ollama, vLLM, etc.).
    These don't have a standardized response shape, so this handles the
    common cases (dict-like or plain string) and otherwise does nothing —
    developers should use the context manager + set_response() for full control.
    """
    try:
        if isinstance(result, dict):
            output_text = result.get("response") or result.get("text") or result.get("output")
            model = result.get("model", "local")
            span.set_response(
                provider="local",
                model=model,
                input_tokens=result.get("prompt_eval_count", 0),
                output_tokens=result.get("eval_count", 0),
                output=output_text,
            )
        elif isinstance(result, str):
            span.set_response(provider="local", model="local", output=result)
    except Exception as e:
        logger.warning(f"Local model adapter failed to parse response: {e}")
        