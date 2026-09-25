import { useCallback, useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

const CHANGE_EVENT = "weather:storage-change";

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T): readonly [T, Dispatch<SetStateAction<T>>] {
  const fallback = useRef(initialValue);
  const [value, setValue] = useState<T>(() => readStorage(key, fallback.current));
  const current = useRef(value);
  current.current = value;

  useEffect(() => {
    const sync = (event: Event) => {
      if (event instanceof StorageEvent && event.key !== key) return;
      if (event instanceof CustomEvent && event.detail !== key) return;
      const next = readStorage(key, fallback.current);
      current.current = next;
      setValue(next);
    };
    window.addEventListener("storage", sync);
    window.addEventListener(CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(CHANGE_EVENT, sync);
    };
  }, [key]);

  const update: Dispatch<SetStateAction<T>> = useCallback((change) => {
    const next = typeof change === "function"
      ? (change as (previous: T) => T)(current.current)
      : change;
    current.current = next;
    setValue(next);
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: key }));
    } catch {
      // Keep the current session usable if storage is disabled.
    }
  }, [key]);

  return [value, update] as const;
}
