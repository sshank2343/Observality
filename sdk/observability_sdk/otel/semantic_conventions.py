# Maps our internal Span fields to OpenTelemetry's GenAI semantic convention
# attribute names, so traces sent via the OTel path use the same standardized
# keys your backend's otlp.controller.js / otel.adapter.js expect.

GEN_AI_SYSTEM = "gen_ai.system"
GEN_AI_REQUEST_MODEL = "gen_ai.request.model"
GEN_AI_USAGE_INPUT_TOKENS = "gen_ai.usage.input_tokens"
GEN_AI_USAGE_OUTPUT_TOKENS = "gen_ai.usage.output_tokens"
GEN_AI_RESPONSE_LATENCY_MS = "gen_ai.response.latency_ms"


def span_to_otel_attributes(span) -> dict:
    """Converts our internal Span object into an OTel GenAI-conventions attribute dict."""
    return {
        GEN_AI_SYSTEM: span.provider,
        GEN_AI_REQUEST_MODEL: span.model,
        GEN_AI_USAGE_INPUT_TOKENS: span.input_tokens,
        GEN_AI_USAGE_OUTPUT_TOKENS: span.output_tokens,
        GEN_AI_RESPONSE_LATENCY_MS: span.latency_ms,
    }