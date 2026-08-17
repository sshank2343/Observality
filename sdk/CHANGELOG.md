# Changelog

## [0.1.0] - 2026-08-14
### Added
- Initial release
- Manual tracing via context manager and `@trace` decorator
- Auto-instrumentation for OpenAI and Anthropic
- Provider adapters: OpenAI, Anthropic, Gemini, local models
- Async batched trace sending with retry logic
- Optional OpenTelemetry export path