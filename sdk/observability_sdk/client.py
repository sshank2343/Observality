from typing import Optional 

from .config import ObservabilityConfig
from .sender import TraceSender
from .exceptions import SDKNotInitializedError

_sender_instance: Optional[TraceSender] = None

def init(api_key: Optional[str] = None, backend_url: Optional[str] = None) -> None:
    """
    Initializes the SDK. Call this once at the start of your application.

    Example:
        import observability_sdk as obs
        obs.init(api_key="obs_live_...", backend_url="http://localhost:4000")
    """
    global _sender_instance

    if api_key:
        config = ObservabilityConfig(
            api_key=api_key,
            backend_url=backend_url or "http://localhost:4000"
        )
    else:
        config = ObservabilityConfig.from_env()

    _sender_instance = TraceSender(config)


def get_sender() -> TraceSender:
    if _sender_instance is None:
        raise SDKNotInitializedError(
            "observability_sdk.init() must be called before sending traces."
        )
    return _sender_instance


def flush() -> None:
    """Force-send any queued traces immediately. Call before process exit."""
    if _sender_instance is not None:
        _sender_instance.flush_sync()


def shutdown() -> None:
    """Flush and close the SDK's background connections."""
    global _sender_instance
    if _sender_instance is not None:
        _sender_instance.shutdown()
        _sender_instance = None