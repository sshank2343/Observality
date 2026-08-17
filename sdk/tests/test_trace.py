import pytest
import observability_sdk as obs
from observability_sdk.span import Span


@pytest.fixture(autouse=True)
def setup_sdk():
    """Runs before every test in this file — ensures a clean, initialized SDK state."""
    obs.init(api_key="obs_live_8fb63ff7271bf4f4f9ba960f047b5e732cc76112fb4595cf", backend_url="http://localhost:4000")
    yield
    obs.shutdown()


def test_span_default_values():
    span = Span()
    assert span.provider == "other"
    assert span.status == "success"
    assert span.input_tokens == 0


def test_span_set_response():
    span = Span()
    span.set_response(
        provider="openai",
        model="gpt-4o-mini",
        input_tokens=10,
        output_tokens=20,
        output="hello",
    )
    assert span.provider == "openai"
    assert span.model == "gpt-4o-mini"
    assert span.output == "hello"


def test_span_set_error():
    span = Span()
    span.set_error(ValueError("something broke"))
    assert span.status == "error"
    assert span.error_message == "something broke"


def test_span_to_payload_shape():
    span = Span(provider="openai", input="hi")
    span.set_response(provider="openai", model="gpt-4o-mini", input_tokens=5, output_tokens=5, output="hey")
    payload = span.to_payload()

    assert payload["provider"] == "openai"
    assert payload["model"] == "gpt-4o-mini"
    assert payload["inputTokens"] == 5
    assert payload["outputTokens"] == 5
    assert "latencyMs" in payload
    assert payload["status"] == "success"


def test_trace_context_manager_enqueues_span(mocker):
    mock_enqueue = mocker.patch.object(obs.get_sender(), "enqueue")

    with obs.trace(provider="openai", input="test") as span:
        span.set_response(provider="openai", model="gpt-4o-mini", output="result")

    mock_enqueue.assert_called_once()
    payload = mock_enqueue.call_args[0][0]
    assert payload["provider"] == "openai"
    assert payload["output"] == "result"


def test_trace_context_manager_captures_exception(mocker):
    mock_enqueue = mocker.patch.object(obs.get_sender(), "enqueue")

    with pytest.raises(ValueError):
        with obs.trace(provider="openai") as span:
            raise ValueError("LLM call failed")

    # exception should propagate (not swallowed) AND still enqueue an error trace
    mock_enqueue.assert_called_once()
    payload = mock_enqueue.call_args[0][0]
    assert payload["status"] == "error"
    assert "LLM call failed" in payload["errorMessage"]


def test_trace_decorator_wraps_function(mocker):
    mock_enqueue = mocker.patch.object(obs.get_sender(), "enqueue")

    @obs.trace(provider="openai")
    def fake_llm_call():
        return "some raw response object"

    result = fake_llm_call()

    assert result == "some raw response object"
    mock_enqueue.assert_called_once()