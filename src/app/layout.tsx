import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Bakbak_One } from "next/font/google";
import "./globals.css";
import { Clock } from "@/components/Clock";
import { FloatingButtons } from "@/components/FloatingButtons";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bakbakOne = Bakbak_One({
  weight: "400",
  variable: "--font-bakbak-one",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "R&O Golf Range",
  description: "Cancha de práctica — vouchers, SportClub y venta de canastos",
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bakbakOne.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <div className="relative min-h-screen flex-1 bg-[#102C1A] overflow-hidden">
            {/* Common background: waves + dots */}
            <div className="pointer-events-none absolute inset-0">
              <svg className="absolute bottom-0 left-0 w-full opacity-[0.08]" viewBox="0 0 1200 200" preserveAspectRatio="none">
                <path fill="none" stroke="url(#wave1)" strokeWidth="1.5" d="M0,100 Q300,40 600,100 T1200,100 V200 H0 Z" />
                <path fill="none" stroke="url(#wave2)" strokeWidth="1" d="M0,120 Q200,80 400,120 T800,120 T1200,120 V200 H0 Z" />
                <defs>
                  <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#EEE4B2" /><stop offset="100%" stopColor="#fef3c7" /></linearGradient>
                  <linearGradient id="wave2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#ffffff" /><stop offset="100%" stopColor="#EEE4B2" /></linearGradient>
                </defs>
              </svg>
              <svg className="absolute top-1/4 right-0 w-1/2 max-w-md opacity-[0.06]" viewBox="0 0 400 150" preserveAspectRatio="xMaxYMid meet">
                <path fill="none" stroke="#EEE4B2" strokeWidth="1" d="M0,75 Q100,20 200,75 T400,75" />
              </svg>
              <svg className="absolute bottom-1/3 left-0 w-1/3 max-w-xs opacity-[0.07]" viewBox="0 0 300 80" preserveAspectRatio="xMinYMid meet">
                <path fill="none" stroke="#fef3c7" strokeWidth="1" d="M0,40 Q75,0 150,40 T300,40" />
              </svg>
              <div className="absolute inset-0 opacity-[0.12]">
                <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                      <circle cx="4" cy="4" r="1" fill="#EEE4B2" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>
              </div>
              <div className="absolute right-[10%] top-[20%] h-2 w-2 rounded-full bg-amber-400/20" />
              <div className="absolute right-[25%] top-[35%] h-1.5 w-1.5 rounded-full bg-white/15" />
              <div className="absolute left-[15%] bottom-[30%] h-2 w-2 rounded-full bg-amber-300/15" />
              <div className="absolute left-[30%] top-[45%] h-1 w-1 rounded-full bg-white/10" />
              <div className="absolute right-[15%] bottom-[25%] h-1.5 w-1.5 rounded-full bg-amber-400/15" />
            </div>
            <div className="relative min-h-screen pb-12 text-white md:pb-14">
              <div
                className="fixed right-4 top-4 z-20 text-lg font-medium text-white/90 md:right-6 md:top-5 md:text-xl"
                style={{ paddingTop: "env(safe-area-inset-top)" }}
              >
                <Clock />
              </div>
              {children}
            </div>
          </div>
          <footer
            className="fixed bottom-0 left-0 right-0 z-10 bg-secondary-bg px-3 py-1.5 text-center text-[10px] leading-tight text-neutral-500 md:text-xs"
            style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
          >
            Copyright R&O Golf Range 2026 - Developed by Rosario Mensi
          </footer>
          <FloatingButtons />
        </div>
      </body>
    </html>
  );
}
