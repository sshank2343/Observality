from ..utils.logger import logger
from .semantic_conventions import span_to_otel_attributes


class OtelExporter:
    """
    Optional alternate emission path — sends spans using OpenTelemetry's SDK
    and OTLP protocol instead of our custom sender.py/HTTP path.

    This is OFF by default (our lightweight custom sender is the default path
    from Steps 13-16). Enable this only if the host app already has OpenTelemetry
    set up and wants a single unified tracing pipeline instead of two.
    """

    def __init__(self, otlp_endpoint: str):
        try:
            from opentelemetry import trace
            from opentelemetry.sdk.trace import TracerProvider
            from opentelemetry.sdk.trace.export import BatchSpanProcessor
            from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
        except ImportError:
            raise ImportError(
                "OTel export requires extra dependencies. Install with: "
                "pip install opentelemetry-sdk opentelemetry-exporter-otlp-proto-http"
            )

        provider = TracerProvider()
        exporter = OTLPSpanExporter(endpoint=otlp_endpoint)
        provider.add_span_processor(BatchSpanProcessor(exporter))
        trace.set_tracer_provider(provider)

        self._tracer = trace.get_tracer("observability_sdk")
        logger.info(f"OTel exporter initialized, sending to {otlp_endpoint}")

    def export_span(self, span) -> None:
        attributes = span_to_otel_attributes(span)
        with self._tracer.start_as_current_span("llm_call", attributes=attributes):
            pass  # attributes are recorded at span creation; no nested work needed here