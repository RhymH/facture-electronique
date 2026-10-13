import type { Metadata } from "next";
import { NOINDEX } from "@/lib/seo";

export const metadata: Metadata = { ...NOINDEX, title: "Démo : la caisse et son ticket" };

export default function CaisseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
