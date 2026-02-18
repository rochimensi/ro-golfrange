"use client";

import { useCallback, useEffect, useState } from "react";
import { AUTO_SERVICIO_STORAGE_KEY } from "./constants";

const CUSTOM_EVENT_NAME = "ro-golfrange-auto-servicio-change";

function readFromStorage(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(AUTO_SERVICIO_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function useAutoServicio(): {
  isAutoServicio: boolean;
  setAutoServicio: (on: boolean) => void;
} {
  const [isAutoServicio, setIsAutoServicio] = useState(false);

  useEffect(() => {
    setIsAutoServicio(readFromStorage());
  }, []);

  useEffect(() => {
    const handleChange = () => setIsAutoServicio(readFromStorage());
    window.addEventListener("storage", handleChange);
    window.addEventListener(CUSTOM_EVENT_NAME, handleChange);
    return () => {
      window.removeEventListener("storage", handleChange);
      window.removeEventListener(CUSTOM_EVENT_NAME, handleChange);
    };
  }, []);

  const setAutoServicio = useCallback((on: boolean) => {
    try {
      localStorage.setItem(AUTO_SERVICIO_STORAGE_KEY, on ? "1" : "0");
      window.dispatchEvent(new Event(CUSTOM_EVENT_NAME));
      setIsAutoServicio(on);
    } catch {
      // ignore
    }
  }, []);

  return { isAutoServicio, setAutoServicio };
}
