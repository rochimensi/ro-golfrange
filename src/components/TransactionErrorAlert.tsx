"use client";

import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface TransactionErrorAlertProps {
  error: string;
  onDismiss: () => void;
  className?: string;
}

export function TransactionErrorAlert({
  error,
  onDismiss,
  className = "",
}: TransactionErrorAlertProps) {
  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/15 px-4 py-3 text-sm text-red-100 ${className}`}
    >
      <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
      <p className="flex-1">{error}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded p-1 text-red-300 hover:bg-red-500/20 hover:text-red-100"
        aria-label="Cerrar"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
