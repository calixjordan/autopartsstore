"use client";

import { useEffect, useState, useCallback } from "react";

interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

// Simple event bus for toasts
const listeners: ((msg: ToastMessage) => void)[] = [];
export function toast(message: string, type: "success" | "error" | "info" = "success") {
  const id = Math.random().toString(36).slice(2);
  listeners.forEach((fn) => fn({ id, type, message }));
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((msg: ToastMessage) => {
    setToasts((prev) => [...prev, msg]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== msg.id));
    }, 3500);
  }, []);

  useEffect(() => {
    listeners.push(addToast);
    return () => {
      const idx = listeners.indexOf(addToast);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-medium animate-slide-up min-w-[240px] border ${
            t.type === "success"
              ? "bg-green-900/90 text-green-100 border-green-500/40"
              : t.type === "error"
              ? "bg-red-900/90 text-red-100 border-red-500/40"
              : "bg-dark-700 text-white border-dark-500"
          }`}
        >
          <span>
            {t.type === "success" ? "✅" : t.type === "error" ? "❌" : "ℹ️"}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}
