import Link from "next/link";
import { Logo } from "./Logo";

const links = [
  { href: "/#comment-ca-marche", label: "Comment ça marche" },
  { href: "/#editeurs", label: "Pour les éditeurs" },
  { href: "/blog", label: "Blog" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white/85 backdrop-blur-md">
      <div className="container flex h-[68px] items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Principale" className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-[15px] font-medium text-ink-2 hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/blog" className="text-[15px] font-medium text-ink-2 hover:text-ink md:hidden">
            Blog
          </Link>
          <Link href="/#liste-attente" className="btn btn-primary btn-sm">
            Rejoindre la liste d&apos;attente
          </Link>
        </div>
      </div>
    </header>
  );
}
