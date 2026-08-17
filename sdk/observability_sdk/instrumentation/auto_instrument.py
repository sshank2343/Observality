from .openai_patch import patch_openai, unpatch_openai
from .anthropic_patch import patch_anthropic, unpatch_anthropic
from ..utils.logger import logger

_active_patches = []


def enable_auto_instrumentation(providers=None):
    """
    Patches supported provider SDKs so every LLM call is traced automatically.

    Args:
        providers: list of provider names to instrument, e.g. ["openai", "anthropic"].
                   If None, attempts to instrument all supported providers
                   (silently skips any that aren't installed).
    """
    global _active_patches

    targets = providers or ["openai", "anthropic"]

    if "openai" in targets:
        patch_openai()
        _active_patches.append("openai")

    if "anthropic" in targets:
        patch_anthropic()
        _active_patches.append("anthropic")

    logger.info(f"Auto-instrumentation enabled for: {_active_patches}")


def disable_auto_instrumentation():
    """Reverts all active patches — mainly useful for tests."""
    global _active_patches

    if "openai" in _active_patches:
        unpatch_openai()
    if "anthropic" in _active_patches:
        unpatch_anthropic()

    _active_patches = []