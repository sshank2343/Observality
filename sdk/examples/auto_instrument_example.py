"""
Zero-config tracing — no decorators, no context managers.
Every OpenAI call anywhere in this file (or any file/module the SDK is
initialized before) gets traced automatically.

Run: python auto_instrument_example.py
Requires: OPENAI_API_KEY env var set.
"""

import observability_sdk as obs
from openai import OpenAI

# This one line instruments every future OpenAI call in the process
obs.init(
    api_key="obs_live_YOUR_API_KEY_HERE",
    backend_url="http://localhost:4000",
    auto_instrument=True,
)

openai_client = OpenAI()


def existing_function_using_openai(prompt: str) -> str:
    """
    This function looks exactly like normal, un-instrumented OpenAI code.
    That's the point — nothing here needed to change.
    """
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content


if __name__ == "__main__":
    answer = existing_function_using_openai("Name three prime numbers.")
    print(f"Answer: {answer}")

    obs.flush()
    print("Trace auto-captured — check your dashboard, no manual instrumentation needed.")