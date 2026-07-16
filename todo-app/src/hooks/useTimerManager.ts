import { useEffect, useRef } from 'react';

export const TIMER_DURATION = 5000; // 5 seconds

export function useTimerManager() {
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const startTimer = (
    instanceId: string,
    callback: () => void,
    duration: number = TIMER_DURATION
  ): void => {
    if (timersRef.current.has(instanceId)) {
      const existingTimer = timersRef.current.get(instanceId);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }
    }

    const timeoutId = setTimeout(() => {
      callback();
      timersRef.current.delete(instanceId);
    }, duration);

    timersRef.current.set(instanceId, timeoutId);
  };

  const cancelTimer = (instanceId: string): void => {
    const timeoutId = timersRef.current.get(instanceId);
    
    if (timeoutId) {
      clearTimeout(timeoutId);
      timersRef.current.delete(instanceId);
    }
  };

  const cleanup = (): void => {
    timersRef.current.forEach((timeoutId, instanceId) => {
      clearTimeout(timeoutId);
    });
    timersRef.current.clear();
  };

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);
  
  return {
    startTimer,
    cancelTimer,
  };
}
