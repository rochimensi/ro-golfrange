"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { XMarkIcon, BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { OPERATING_HOURS } from "@/lib/constants";

const CATALOG_URL = "https://wa.me/c/5491159841197";

export function FloatingButtons() {
  const pathname = usePathname();
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [whatsappOpen, setWhatsappOpen] = useState(false);

  // Hide floating buttons on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* WhatsApp contacto modal */}
      {whatsappOpen && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setWhatsappOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-heading text-lg font-semibold text-[#102C1A]">
                Contactate por Whatsapp
              </h3>
              <button
                type="button"
                onClick={() => setWhatsappOpen(false)}
                className="rounded-full p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Cerrar"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <p className="mt-4 text-center text-sm text-neutral-700">
              Mandanos cualquier consulta o reportanos un inconveniente. Nos
              comunicaremos enseguida.
            </p>
            <div className="mt-4 flex justify-center overflow-hidden rounded-xl bg-white p-4 ring-1 ring-neutral-200">
              <Image
                src="/whatsapp-qr.png?v=2"
                alt="QR WhatsApp — Escaneá para contactar a R&O Golf."
                width={240}
                height={240}
                className="h-auto w-full max-w-[240px] object-contain"
                unoptimized
              />
            </div>
            <button
              type="button"
              onClick={() => setWhatsappOpen(false)}
              className="mt-6 w-full rounded-xl bg-[#102C1A] px-4 py-3 font-medium text-white hover:bg-[#0d2216]"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Catalog modal */}
      {catalogOpen && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setCatalogOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-heading text-lg font-semibold text-[#102C1A]">
                Catálogo en WhatsApp
              </h3>
              <button
                type="button"
                onClick={() => setCatalogOpen(false)}
                className="rounded-full p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Cerrar"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <p className="mt-4 text-center text-sm text-neutral-700">
              Escaneá el QR para ver nuestro catálogo en WhatsApp. Vas a encontrar todas las novedades de <strong>TaylorMade</strong> y mucho más.
            </p>
            <div className="mt-4 flex justify-center rounded-xl bg-white p-4 ring-1 ring-neutral-200">
              <QRCodeSVG value={CATALOG_URL} size={200} level="M" />
            </div>
            <button
              type="button"
              onClick={() => setCatalogOpen(false)}
              className="mt-6 w-full rounded-xl bg-[#102C1A] px-4 py-3 font-medium text-white hover:bg-[#0d2216]"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Right column: vertical schedule text above floating buttons */}
      <div
        className="fixed z-20 flex flex-col items-end gap-3"
        style={{
          bottom: "max(5rem, calc(env(safe-area-inset-bottom) + 4rem))",
          right: "max(1rem, env(safe-area-inset-right))",
        }}
      >
        <div
          className="flex h-14 w-14 items-center justify-center overflow-visible md:h-16 md:w-16"
          style={{ transform: "translateY(-6rem)" }}
        >
          <p
            className="origin-center text-sm font-medium text-white/90 drop-shadow-md md:text-base"
            style={{ transform: "rotate(90deg)", whiteSpace: "nowrap" }}
          >
            {OPERATING_HOURS}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCatalogOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37] text-white shadow-lg transition hover:bg-[#C5A028] md:h-16 md:w-16"
          aria-label="Ver catálogo WhatsApp"
        >
          <BuildingStorefrontIcon className="h-7 w-7 md:h-8 md:w-8" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={() => setWhatsappOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:bg-[#20bd5a] md:h-16 md:w-16"
          aria-label="WhatsApp"
        >
          <WhatsAppIcon className="h-7 w-7 md:h-8 md:w-8" />
        </button>
      </div>
    </>
  );
}
