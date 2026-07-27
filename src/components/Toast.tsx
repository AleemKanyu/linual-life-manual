import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  text: string;
  type?: "success" | "info" | "error" | "warning";
}

let toastListeners: Array<(toast: ToastMessage) => void> = [];

export const showToast = (text: string, type: ToastMessage["type"] = "success") => {
  const toast: ToastMessage = {
    id: "toast_" + Date.now() + Math.random().toString(36).substr(2, 4),
    text,
    type,
  };
  toastListeners.forEach((listener) => listener(toast));
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleNewToast = (newToast: ToastMessage) => {
      setToasts((prev) => [...prev.slice(-3), newToast]); // Keep max 4 toasts
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3500);
    };

    toastListeners.push(handleNewToast);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== handleNewToast);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[#2D2D2A] text-white shadow-xl border border-white/10 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {toast.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : toast.type === "info" ? (
              <Info className="w-4 h-4 text-sky-300 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#B07D62] shrink-0" />
            )}
            <span className="truncate">{toast.text}</span>
          </div>
          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="p-1 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
