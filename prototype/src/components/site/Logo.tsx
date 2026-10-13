import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

/** Marque : un ticket dont le coin se détache en QR, et le nom en caractères d'affiche. */
export function Logo({ onInk = false }: { onInk?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5" aria-label={`${SITE_NAME}, accueil`}>
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden className="shrink-0">
        <rect x="3" y="2" width="20" height="26" rx="3" fill={onInk ? "#ffffff" : "#141b2d"} />
        <rect x="7" y="7" width="12" height="2" rx="1" fill={onInk ? "#141b2d" : "#ffffff"} />
        <rect x="7" y="11" width="8" height="2" rx="1" fill={onInk ? "#141b2d" : "#ffffff"} />
        <rect x="15" y="15" width="12" height="12" rx="2.5" fill="#ffe34d" />
        <rect x="18" y="18" width="2.5" height="2.5" fill="#141b2d" />
        <rect x="21.5" y="18" width="2.5" height="2.5" fill="#141b2d" />
        <rect x="18" y="21.5" width="2.5" height="2.5" fill="#141b2d" />
        <rect x="22.5" y="22.5" width="1.5" height="1.5" fill="#141b2d" />
      </svg>
      <span className={`font-headline text-[22px] font-bold tracking-[-0.03em] ${onInk ? "text-white" : "text-ink"}`}>
        {SITE_NAME}
      </span>
    </Link>
  );
}
