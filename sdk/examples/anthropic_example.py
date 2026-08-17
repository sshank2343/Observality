"""
Manual tracing with Anthropic's Claude API.
Run: python anthropic_example.py
Requires: ANTHROPIC_API_KEY env var set.
"""

import observability_sdk as obs
from anthropic import Anthropic

obs.init(
    api_key="obs_live_YOUR_API_KEY_HERE",
    backend_url="http://localhost:4000",
)

anthropic_client = Anthropic()  # uses ANTHROPIC_API_KEY from environment


def ask_claude(question: str) -> str:
    with obs.trace(provider="anthropic", input=question) as span:
        response = anthropic_client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=200,
            messages=[{"role": "user", "content": question}],
        )

        answer = response.content[0].text
        span.set_response(
            provider="anthropic",
            model=response.model,
            input_tokens=response.usage.input_tokens,
            output_tokens=response.usage.output_tokens,
            output=answer,
        )
        return answer


if __name__ == "__main__":
    answer = ask_claude("Explain recursion in one sentence.")
    print(f"Claude says: {answer}")

    obs.flush()
    print("Trace sent to observability dashboard.")