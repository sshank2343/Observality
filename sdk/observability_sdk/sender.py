import asyncio
import threading
from typing import Any, Dict, List

import httpx

from .config import ObservabilityConfig
from .exceptions import IngestionError
from .utils.logger import logger
from .utils.retry import retry_async


class TraceSender:
    """
    Batches traces in memory and flushes them to the backend on a timer
    or when the batch size is reached — so tracing never blocks the
    host application's real request path.
    """

    def __init__(self, config: ObservabilityConfig):
        self.config = config
        self._queue: List[Dict[str, Any]] = []
        self._lock = threading.Lock()
        self._loop = None
        self._flush_task = None
        self._client = httpx.AsyncClient(
            base_url=config.backend_url,
            timeout=config.timeout_seconds,
            headers={"X-API-Key": config.api_key, "Content-Type": "application/json"},
        )
        self._start_background_loop()

    def _start_background_loop(self):
        """Runs a dedicated asyncio event loop in a background thread,
        so the SDK works fine even in a synchronous (non-async) host app."""
        self._loop = asyncio.new_event_loop()

        def run_loop():
            asyncio.set_event_loop(self._loop)
            self._loop.run_forever()

        thread = threading.Thread(target=run_loop, daemon=True)
        thread.start()

        asyncio.run_coroutine_threadsafe(self._periodic_flush(), self._loop)

    async def _periodic_flush(self):
        while True:
            await asyncio.sleep(self.config.flush_interval_seconds)
            await self._flush()

    def enqueue(self, trace_data: Dict[str, Any]):
        with self._lock:
            self._queue.append(trace_data)
            should_flush_now = len(self._queue) >= self.config.batch_size

        if should_flush_now:
            asyncio.run_coroutine_threadsafe(self._flush(), self._loop)

    async def _flush(self):
        with self._lock:
            if not self._queue:
                return
            batch = self._queue[:]
            self._queue.clear()

        for trace_data in batch:
            try:
                await retry_async(lambda t=trace_data: self._send_one(t))
            except Exception as e:
                logger.warning(f"Failed to send trace after retries: {e}")

    async def _send_one(self, trace_data: Dict[str, Any]):
        try:
            response = await self._client.post("/api/traces", json=trace_data)
            if response.status_code >= 400:
                raise IngestionError(
                    f"Backend rejected trace: {response.status_code} {response.text}"
                )
        except httpx.HTTPError as e:
            raise IngestionError(f"Network error sending trace: {e}")

    def flush_sync(self):
        """Force an immediate flush — useful before process exit."""
        future = asyncio.run_coroutine_threadsafe(self._flush(), self._loop)
        future.result(timeout=self.config.timeout_seconds + 2)

    def shutdown(self):
        self.flush_sync()
        asyncio.run_coroutine_threadsafe(self._client.aclose(), self._loop)