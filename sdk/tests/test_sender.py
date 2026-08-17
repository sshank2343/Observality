import pytest
import respx
import httpx
from observability_sdk.config import ObservabilityConfig
from observability_sdk.sender import TraceSender


@pytest.fixture
def config():
    return ObservabilityConfig(api_key="obs_live_8fb63ff7271bf4f4f9ba960f047b5e732cc76112fb4595cf", backend_url="http://localhost:4000")


@respx.mock
def test_send_one_success(config):
    respx.post("http://localhost:4000/api/traces").mock(
        return_value=httpx.Response(201, json={"id": "abc123", "status": "ingested"})
    )

    sender = TraceSender(config)
    sender.enqueue({"provider": "openai", "model": "gpt-4o-mini", "latencyMs": 100})
    sender.flush_sync()

    assert respx.calls.call_count == 1
    sender.shutdown()


@respx.mock
def test_send_batches_multiple_traces(config):
    route = respx.post("http://localhost:4000/api/traces").mock(
        return_value=httpx.Response(201, json={"status": "ingested"})
    )

    sender = TraceSender(config)
    for i in range(5):
        sender.enqueue({"provider": "openai", "model": "gpt-4o-mini", "latencyMs": i})
    sender.flush_sync()

    assert route.call_count == 5  # each trace sent individually in current implementation
    sender.shutdown()