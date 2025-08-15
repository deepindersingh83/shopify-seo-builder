import { useState, useCallback } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

interface UseLoadingReturn {
  isLoading: (key: string) => boolean;
  setLoading: (key: string, loading: boolean) => void;
  withLoading: <T>(key: string, asyncFn: () => Promise<T>) => Promise<T>;
  clearLoading: () => void;
}

export function useLoading(): UseLoadingReturn {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});

  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading,
    }));
  }, []);

  const withLoading = useCallback(async <T>(key: string, asyncFn: () => Promise<T>): Promise<T> => {
    setLoading(key, true);
    try {
      const result = await asyncFn();
      return result;
    } finally {
      setLoading(key, false);
    }
  }, [setLoading]);

  const clearLoading = useCallback(() => {
    setLoadingStates({});
  }, []);

  return {
    isLoading,
    setLoading,
    withLoading,
    clearLoading,
  };
}

// Global loading state for app-wide operations
let globalLoadingFn: ((key: string, loading: boolean) => void) | null = null;
let globalIsLoadingFn: ((key: string) => boolean) | null = null;

export function setGlobalLoadingFunctions(
  setLoading: (key: string, loading: boolean) => void,
  isLoading: (key: string) => boolean
) {
  globalLoadingFn = setLoading;
  globalIsLoadingFn = isLoading;
}

export function setGlobalLoading(key: string, loading: boolean) {
  if (globalLoadingFn) {
    globalLoadingFn(key, loading);
  }
}

export function isGlobalLoading(key: string): boolean {
  return globalIsLoadingFn ? globalIsLoadingFn(key) : false;
}
