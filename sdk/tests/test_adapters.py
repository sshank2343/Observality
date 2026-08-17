from types import SimpleNamespace
from observability_sdk.span import Span
from observability_sdk.adapters import openai_adapter, anthropic_adapter, gemini_adapter, local_model_adapter
from observability_sdk.adapters import get_adapter


def test_get_adapter_returns_correct_module():
    assert get_adapter("openai") is openai_adapter
    assert get_adapter("anthropic") is anthropic_adapter
    assert get_adapter("unknown_provider") is None


def test_openai_adapter_extracts_fields():
    # Simulates the shape of openai>=1.0's ChatCompletion response object
    fake_response = SimpleNamespace(
        model="gpt-4o-mini",
        usage=SimpleNamespace(prompt_tokens=15, completion_tokens=25),
        choices=[SimpleNamespace(message=SimpleNamespace(content="Hello there"))],
    )

    span = Span()
    openai_adapter.populate_span(span, fake_response)

    assert span.provider == "openai"
    assert span.model == "gpt-4o-mini"
    assert span.input_tokens == 15
    assert span.output_tokens == 25
    assert span.output == "Hello there"


def test_anthropic_adapter_extracts_fields():
    fake_response = SimpleNamespace(
        model="claude-sonnet-4-6",
        usage=SimpleNamespace(input_tokens=12, output_tokens=30),
        content=[SimpleNamespace(text="Hi from Claude")],
    )

    span = Span()
    anthropic_adapter.populate_span(span, fake_response)

    assert span.provider == "anthropic"
    assert span.model == "claude-sonnet-4-6"
    assert span.input_tokens == 12
    assert span.output == "Hi from Claude"


def test_gemini_adapter_extracts_fields():
    fake_response = SimpleNamespace(
        text="Hi from Gemini",
        usage_metadata=SimpleNamespace(prompt_token_count=8, candidates_token_count=16),
    )

    span = Span()
    gemini_adapter.populate_span(span, fake_response)

    assert span.provider == "gemini"
    assert span.input_tokens == 8
    assert span.output == "Hi from Gemini"


def test_local_model_adapter_handles_dict():
    fake_response = {
        "response": "local model output",
        "model": "llama3",
        "prompt_eval_count": 5,
        "eval_count": 10,
    }

    span = Span()
    local_model_adapter.populate_span(span, fake_response)

    assert span.provider == "local"
    assert span.model == "llama3"
    assert span.output == "local model output"


def test_adapter_never_raises_on_malformed_response():
    """Adapters must fail silently — a malformed response should never crash the host app."""
    span = Span()
    openai_adapter.populate_span(span, object())  # garbage input, no expected attributes
    # span should remain in its default state, no exception raised
    assert span.output is None