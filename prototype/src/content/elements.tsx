import Link from "next/link";
import type { ReactNode } from "react";

/** Un encadré « sur le terrain », marqué au feutre. */
export function Callout({ who, children }: { who?: string; children: ReactNode }) {
  return (
    <aside className="callout">
      {who && <span className="who">{who}</span>}
      <p>{children}</p>
    </aside>
  );
}

export function InternalLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href}>{children}</Link>;
}
