# obs_live_915de7c9f0c100762f0159762a9e3ad8773a7241422278f0
# test_live.py
import observability_sdk as obs

obs.init(
    api_key="obs_live_915de7c9f0c100762f0159762a9e3ad8773a7241422278f0",
    backend_url="https://observality.onrender.com"
)

with obs.trace(provider="openai", input="What is 2+2?") as span:
    span.set_response(
        provider="openai",
        model="gpt-4o-mini",
        input_tokens=10,
        output_tokens=5,
        output="4",
    )

obs.flush()
print("Trace sent to live backend!")