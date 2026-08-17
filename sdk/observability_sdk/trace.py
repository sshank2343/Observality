import functools
from contextlib import contextmanager
from typing import Optional

from .client import get_sender
from .span import Span


class TraceContext:
    """
    Tracing context manager and decorator:

    Context manager usage:
        with observability_sdk.trace(provider="openai", input="What is 2+2?") as span:
            span.set_response(
                provider="openai",
                model="gpt-4o-mini",
                input_tokens=10,
                output_tokens=5,
                output="4",
            )

    Decorator usage:
        @observability_sdk.trace(provider="openai")
        def call_llm(prompt):
            return openai_client.chat.completions.create(...)
    """

    def __init__(
        self,
        provider: str = "other",
        input: Optional[str] = None,
        metadata: Optional[dict] = None,
        **extra_metadata
    ):
        self.provider = provider
        self.input = input
        combined_metadata = dict(metadata or {})
        combined_metadata.update(extra_metadata)
        self.metadata = combined_metadata
        self.span = Span(provider=provider, input=input, metadata=self.metadata)

    def __enter__(self) -> Span:
        return self.span

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_val is not None:
            self.span.set_error(exc_val)

        try:
            sender = get_sender()
            sender.enqueue(self.span.to_payload())
        except Exception:
            # Never let tracing failures break the host application
            pass

        # Returning False (default) re-raises the original exception, if any —
        # tracing should be invisible, it must not swallow real errors.
        return False

    def __call__(self, func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            with TraceContext(provider=self.provider, input=self.input, metadata=self.metadata) as span:
                result = func(*args, **kwargs)
                _try_auto_populate(span, self.provider, result)
                return result

        return wrapper


def trace(provider=None, **trace_kwargs):
    """
    Supports both context manager and decorator forms of tracing:

    1. Context manager form:
       with observability_sdk.trace(provider="openai") as span:
           ...

    2. Decorator with arguments:
       @observability_sdk.trace(provider="openai")
       def call_llm():
           ...

    3. Decorator without arguments:
       @observability_sdk.trace
       def call_llm():
           ...
    """
    if callable(provider):
        func = provider
        ctx = TraceContext(provider="other", **trace_kwargs)
        return ctx(func)

    if provider is None:
        provider = "other"

    return TraceContext(provider=provider, **trace_kwargs)



def _try_auto_populate(span: Span, provider: str, result):
    """Best-effort extraction of tokens/model/output from a raw provider response,
    using the adapters. Falls back silently if the shape doesn't match — the
    context manager form remains the reliable path for custom cases."""
    try:
        from .adapters import get_adapter
        adapter = get_adapter(provider)
        if adapter:
            adapter.populate_span(span, result)
    except Exception:
        pass