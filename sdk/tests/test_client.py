import os
import pytest
import observability_sdk as obs
from observability_sdk.exceptions import SDKNotInitializedError


def test_init_requires_api_key_if_not_in_env(monkeypatch):
    monkeypatch.delenv("OBSERVABILITY_API_KEY", raising=False)
    obs.shutdown()  # ensure clean state from any previous test

    with pytest.raises(ValueError):
        obs.init()  # no api_key passed, none in env -> should raise


def test_init_with_explicit_api_key():
    obs.init(api_key="obs_live_8fb63ff7271bf4f4f9ba960f047b5e732cc76112fb4595cf", backend_url="http://localhost:4000")
    sender = obs.get_sender()
    assert sender is not None
    assert sender.config.api_key == "obs_live_8fb63ff7271bf4f4f9ba960f047b5e732cc76112fb4595cf"
    obs.shutdown()


def test_get_sender_before_init_raises():
    obs.shutdown()  # ensure not initialized
    with pytest.raises(SDKNotInitializedError):
        obs.get_sender()


def test_init_from_env_var(monkeypatch):
    monkeypatch.setenv("OBSERVABILITY_API_KEY", "obs_live_fromenv")
    monkeypatch.setenv("OBSERVABILITY_BACKEND_URL", "http://localhost:5000")

    obs.init()
    sender = obs.get_sender()
    assert sender.config.api_key == "obs_live_fromenv"
    assert sender.config.backend_url == "http://localhost:5000"
    obs.shutdown()