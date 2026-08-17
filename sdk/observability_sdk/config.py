import os
from dataclasses import dataclass

@dataclass
class ObservabilityConfig:
    api_key: str
    backend_url: str = "http://localhost:4000"
    flush_interval_seconds: float = 2.0
    batch_size: int = 20
    timeout_seconds: float = 5.0

    @classmethod
    def from_env(cls) -> "ObservabilityConfig":
        api_key = os.environ.get("OBSERVABILITY_API_KEY")
        if not api_key:
            raise ValueError(
                "OBSERVABILITY_API_KEY not set. Pass api_key explicitly to init(), "
                "or set it as an environment variable."
            )
        backend_url = os.environ.get("OBSERVABILITY_BACKEND_URL", "http://localhost:4000")
        return cls(api_key=api_key, backend_url=backend_url)