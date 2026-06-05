import { useState, useEffect } from 'react';

/**
 * TrendAura Reactive LocalStorage Synchronizer
 * Automatically captures, parses, and serializes state changes into local buffers.
 */
export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`❌ [useLocalStorage Parse  Error] on key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`❌ [useLocalStorage Write  Error] on key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}