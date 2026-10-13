import Link from "next/link";
import { ARTICLES } from "@/content/articles";
import { CONTACT, SITE_NAME } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper-2">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-ink-2">
            Un module en marque blanche pour les logiciels de caisse. Le client scanne son ticket, la facture électronique
            part, la caisse est prévenue.
          </p>
        </div>
        <div>
          <p className="h-small text-[16px]">Le produit</p>
          <ul className="mt-3 space-y-2 text-[15px] text-ink-2">
            <li>
              <Link href="/#comment-ca-marche" className="hover:text-ink">
                Comment ça marche
              </Link>
            </li>
            <li>
              <Link href="/#editeurs" className="hover:text-ink">
                Pour les éditeurs de caisse
              </Link>
            </li>
            <li>
              <Link href="/#questions" className="hover:text-ink">
                Questions fréquentes
              </Link>
            </li>
            <li>
              <Link href="/#liste-attente" className="hover:text-ink">
                Liste d&apos;attente
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="h-small text-[16px]">Pour aller plus loin</p>
          <ul className="mt-3 space-y-2 text-[15px] text-ink-2">
            <li>
              <Link href="/blog" className="hover:text-ink">
                Le blog
              </Link>
            </li>
            {ARTICLES.map((a) => (
              <li key={a.slug}>
                <Link href={`/blog/${a.slug}`} className="hover:text-ink">
                  {a.seoTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="h-small text-[16px]">Nous écrire</p>
          <ul className="mt-3 space-y-2 text-[15px] text-ink-2">
            <li>
              <a href={`mailto:${CONTACT.email}`} className="hover:text-ink">
                {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container flex flex-wrap items-center justify-between gap-2 border-t border-line py-5 text-[13.5px] text-ink-2">
        <span>
          {SITE_NAME} {new Date().getFullYear()}. Conçu en France pour les éditeurs de caisse français.
        </span>
        <span>Ce site ne dépose aucun cookie.</span>
      </div>
    </footer>
  );
}
