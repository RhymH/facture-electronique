import type { Metadata } from "next";
import { NOINDEX } from "@/lib/seo";
import "../mobile.css";

export const metadata: Metadata = { ...NOINDEX, title: "Démo : le téléphone du client" };

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="phone-stage">
      <div className="phone-frame">
        <div className="phone-screen">{children}</div>
      </div>
    </div>
  );
}
