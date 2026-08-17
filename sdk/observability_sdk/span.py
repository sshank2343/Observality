import time
from dataclasses import dataclass, field
from typing import Any, Dict, Optional


@dataclass
class Span:
    """
    Represents one traced LLM call. Fields map directly onto the
    canonical trace schema the backend expects (see shared/schemas/trace-schema.json).
    """
    provider: str = "other"
    model: str = "unknown"
    input_tokens: int = 0
    output_tokens: int = 0
    latency_ms: float = 0.0
    status: str = "success"
    error_message: Optional[str] = None
    input: Optional[str] = None
    output: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

    _start_time: float = field(default_factory=time.perf_counter, repr=False)

    def set_response(self, *, provider: str, model: str, input_tokens: int = 0,
                      output_tokens: int = 0, output: Optional[str] = None):
        """Called after the LLM responds — fills in the real provider/model/usage data."""
        self.provider = provider
        self.model = model
        self.input_tokens = input_tokens
        self.output_tokens = output_tokens
        self.output = output

    def set_error(self, error: Exception):
        self.status = "error"
        self.error_message = str(error)

    def _finalize_latency(self):
        self.latency_ms = round((time.perf_counter() - self._start_time) * 1000, 2)

    def to_payload(self) -> Dict[str, Any]:
        """Converts this span into the JSON payload the backend's /api/traces expects."""
        self._finalize_latency()
        payload = {
            "provider": self.provider,
            "model": self.model,
            "inputTokens": self.input_tokens,
            "outputTokens": self.output_tokens,
            "latencyMs": self.latency_ms,
            "status": self.status,
        }
        if self.error_message:
            payload["errorMessage"] = self.error_message
        if self.input:
            payload["input"] = self.input
        if self.output:
            payload["output"] = self.output
        if self.metadata:
            payload["metadata"] = self.metadata
        return payload