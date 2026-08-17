class ObservabilitySDKError(Exception):
    """Base exception for all SDK errors."""


class SDKNotInitializedError(ObservabilitySDKError):
    """Raised when trace() or auto-instrumentation is used before init() is called."""


class IngestionError(ObservabilitySDKError):
    """Raised when the backend rejects or fails to receive a trace."""


class UnsupportedProviderError(ObservabilitySDKError):
    """Raised when an adapter is requested for a provider the SDK doesn't support."""