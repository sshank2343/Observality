"""
Fully manual tracing — useful for local/self-hosted models or any custom
LLM call that doesn't match a built-in provider adapter.

Run: python manual_trace_example.py
"""

import time
import observability_sdk as obs

obs.init(
    api_key="obs_live_YOUR_API_KEY_HERE",
    backend_url="http://localhost:4000",
)


def call_my_custom_model(prompt: str) -> str:
    """Simulates a call to a self-hosted or custom model with no adapter support."""
    time.sleep(0.4)  # pretend this is real inference time
    return f"Simulated response to: {prompt}"


if __name__ == "__main__":
    prompt = "What's the weather like on Mars?"

    with obs.trace(provider="local", input=prompt, metadata={"deployment": "on-prem-server-1"}) as span:
        output = call_my_custom_model(prompt)

        span.set_response(
            provider="local",
            model="my-custom-llama-finetune",
            input_tokens=len(prompt.split()),   # rough manual token estimate
            output_tokens=len(output.split()),
            output=output,
        )

    print(f"Output: {output}")

    obs.flush()
    print("Trace sent — even fully custom/self-hosted models are supported.")