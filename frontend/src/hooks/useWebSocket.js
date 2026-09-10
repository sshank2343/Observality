import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthContext } from '../context/AuthContext';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:4000';
const MAX_RETRY_DELAY = 10000; // cap backoff at 10s

export const useWebSocket = (onMessage) => {
  const { token, isAuthenticated } = useAuthContext();
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const onMessageRef = useRef(onMessage);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef(null);
  const isUnmountedRef = useRef(false);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const connect = useCallback(() => {
    if (!isAuthenticated || !token || isUnmountedRef.current) return;

    const ws = new WebSocket(`${WS_URL}/ws?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      retryCountRef.current = 0; // reset backoff on success
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessageRef.current?.(data);
      } catch {
        // ignore malformed messages
      }
    };

    ws.onclose = () => {
      setConnected(false);
      if (isUnmountedRef.current) return;

      // Retry with exponential backoff — handles cold starts and drops gracefully
      const delay = Math.min(1000 * 2 ** retryCountRef.current, MAX_RETRY_DELAY);
      retryCountRef.current += 1;
      retryTimeoutRef.current = setTimeout(connect, delay);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [isAuthenticated, token]);

  useEffect(() => {
    isUnmountedRef.current = false;
    connect();

    return () => {
      isUnmountedRef.current = true;
      clearTimeout(retryTimeoutRef.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [connect]);

  return { connected };
};