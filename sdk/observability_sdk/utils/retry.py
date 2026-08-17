import asyncio
from typing import Callable, TypeVar, Awaitable

T = TypeVar("T")


async def retry_async(
    fn: Callable[[], Awaitable[T]],
    max_attempts: int = 3,
    base_delay: float = 0.5,
) -> T:
    """Retries an async function with exponential backoff. Re-raises the last error."""
    last_exception = None

    for attempt in range(max_attempts):
        try:
            return await fn()
        except Exception as e:
            last_exception = e
            if attempt < max_attempts - 1:
                delay = base_delay * (2 ** attempt)
                await asyncio.sleep(delay)

    raise last_exception