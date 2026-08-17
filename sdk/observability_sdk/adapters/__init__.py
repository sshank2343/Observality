from . import openai_adapter, anthropic_adapter, gemini_adapter, local_model_adapter

_ADAPTER_REGISTRY = {
    "openai": openai_adapter,
    "anthropic": anthropic_adapter,
    "gemini": gemini_adapter,
    "local": local_model_adapter,
}


def get_adapter(provider: str):
    """Returns the adapter module for a given provider, or None if unsupported."""
    return _ADAPTER_REGISTRY.get(provider)