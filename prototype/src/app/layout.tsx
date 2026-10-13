import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Courier_Prime } from "next/font/google";
import "./globals.css";

const ui = Instrument_Sans({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const receipt = Courier_Prime({
  variable: "--font-receipt",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Forme B — Facture en caisse",
  description: "Prototype : facture électronique B2B obtenue en scannant le QR code du ticket.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${ui.variable} ${receipt.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
