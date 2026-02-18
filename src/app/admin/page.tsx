"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { APP_NAME } from "@/lib/constants";
import { useAutoServicio } from "@/lib/useAutoServicio";

export default function AdminPage() {
  const { isAutoServicio, setAutoServicio } = useAutoServicio();

  return (
    <div className="flex min-h-screen flex-col text-white">
      <header className="relative flex items-center border-b border-white/10 px-6 py-4">
        <Link
          href="/"
          className="relative z-10 inline-flex items-center gap-2 text-base text-white/90 hover:text-white md:text-lg"
        >
          <ArrowLeftIcon className="h-6 w-6 md:h-7 md:w-7" />
          INICIO
        </Link>
        <h1 className="absolute left-0 right-0 text-center font-heading text-xl font-bold md:text-2xl pointer-events-none">
          {APP_NAME} — Admin
        </h1>
      </header>

      <main className="flex flex-1 flex-col px-6 py-10">
        <div className="mx-auto w-full max-w-md space-y-8">
          <section className="rounded-xl border border-white/20 bg-white/5 p-6">
            <h2 className="font-heading text-xl font-semibold md:text-2xl">
              Auto-Servicio
            </h2>
            <p className="mt-2 text-sm text-white/75">
              Si está activado, en la compra solo se muestra Transferencia (se oculta Efectivo) y se muestra el mensaje para el cliente.
            </p>
            <div className="mt-6 flex items-center justify-between gap-4">
              <span className="text-base font-medium text-white/90">
                Estado: {isAutoServicio ? "Activado" : "Desactivado"}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={isAutoServicio}
                onClick={() => setAutoServicio(!isAutoServicio)}
                className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#102C1A] ${
                  isAutoServicio ? "bg-amber-500" : "bg-white/20"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition ${
                    isAutoServicio ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
