import { useEffect, useRef, useCallback } from 'react';

const TIMER_DURATION = 5000;

export function useTimerManager() {
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const startTimer = useCallback(
    (instanceId: string, callback: () => void): void => {
      if (timersRef.current.has(instanceId)) {
        const existingTimer = timersRef.current.get(instanceId);
        if (existingTimer) {
          clearTimeout(existingTimer);
        }
      }

      const timeoutId = setTimeout(() => {
        callback();
        timersRef.current.delete(instanceId);
      }, TIMER_DURATION);

      timersRef.current.set(instanceId, timeoutId);
    },
    []
  );

  const cancelTimer = useCallback(
    (instanceId: string): void => {
      const timeoutId = timersRef.current.get(instanceId);

      if (timeoutId) {
        clearTimeout(timeoutId);
        timersRef.current.delete(instanceId);
      }
    },
    []
  );

  useEffect(() => {
    const timers = timersRef.current;

    return () => {
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, []);

  return {
    startTimer,
    cancelTimer,
  };
}
