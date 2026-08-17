"""
Basic manual tracing example using the context manager form.
Run: python basic_openai_example.py
Requires: OPENAI_API_KEY env var set, and a valid observability API key below.
"""

import observability_sdk as obs
from openai import OpenAI

# Initialize the SDK — point this at your deployed backend, or localhost for local dev
obs.init(
    api_key="obs_live_8fb63ff7271bf4f4f9ba960f047b5e732cc76112fb4595cf",
    backend_url="http://localhost:4000",
)

openai_client = OpenAI()  # uses OPENAI_API_KEY from environment


def ask_question(question: str) -> str:
    with obs.trace(provider="openai", input=question) as span:
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": question}],
        )

        answer = response.choices[0].message.content
        span.set_response(
            provider="openai",
            model=response.model,
            input_tokens=response.usage.prompt_tokens,
            output_tokens=response.usage.completion_tokens,
            output=answer,
        )
        return answer


if __name__ == "__main__":
    answer = ask_question("What is the speed of light?")
    print(f"Answer: {answer}")

    # Ensure the trace is sent before the script exits
    obs.flush()
    print("Trace sent to observability dashboard.")