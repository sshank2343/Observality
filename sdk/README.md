# observability-sdk

Lightweight Python SDK for tracing LLM calls — cost, latency, tokens, and quality — into your AI Observability Platform dashboard.

## Install

```bash
pip install observability-sdk
```

## Quick start (zero-config)

```python
import observability_sdk as obs
from openai import OpenAI

obs.init(api_key="obs_live_...", auto_instrument=True)

client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "hello"}]
)
# That's it — this call is now automatically traced
```

## Manual tracing

```python
with obs.trace(provider="openai", input="hello") as span:
    response = client.chat.completions.create(...)
    span.set_response(
        provider="openai",
        model=response.model,
        input_tokens=response.usage.prompt_tokens,
        output_tokens=response.usage.completion_tokens,
        output=response.choices[0].message.content,
    )
```

## Supported providers
OpenAI, Anthropic, Gemini, and local/self-hosted models (via manual tracing).

## Configuration

| Parameter | Description | Default |
|---|---|---|
| `api_key` | Your platform API key (or set `OBSERVABILITY_API_KEY` env var) | required |
| `backend_url` | Your backend's URL | `http://localhost:4000` |
| `auto_instrument` | Automatically trace all OpenAI/Anthropic calls | `False` |

## License
MIT