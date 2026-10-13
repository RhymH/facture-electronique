import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { FinalCta } from "@/components/site/FinalCta";
import { ARTICLES, readableDate } from "@/content/articles";
import { ORG_ID, WEBSITE_ID, graph } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Blog : la facturation électronique vue depuis la caisse";
const DESCRIPTION =
  "Des guides pour les éditeurs de logiciels de caisse : intégrer la facturation électronique B2B, brancher une plateforme agréée, générer du Factur-X, éviter le double comptage avec l'e-reporting.";

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: "/blog", absoluteTitle: true });

export default function BlogPage() {
  return (
    <>
      <JsonLd
        data={graph({
          "@type": "Blog",
          "@id": `${absoluteUrl("/blog")}#blog`,
          url: absoluteUrl("/blog"),
          name: TITLE,
          description: DESCRIPTION,
          inLanguage: "fr",
          isPartOf: { "@id": WEBSITE_ID },
          publisher: { "@id": ORG_ID },
          blogPost: ARTICLES.map((a) => ({
            "@type": "BlogPosting",
            headline: a.title,
            url: absoluteUrl(`/blog/${a.slug}`),
            datePublished: a.published,
            inLanguage: "fr",
          })),
        })}
      />
      <section className="container pt-10 pb-16 lg:pt-14 lg:pb-24">
        <Breadcrumbs items={[{ name: "Blog", path: "/blog" }]} />
        <h1 className="h-display mt-8 max-w-[18ch] text-[clamp(36px,5.5vw,64px)]">
          La facturation électronique, vue depuis la caisse.
        </h1>
        <p className="lead mt-6 max-w-[56ch]">
          Ce qu&apos;un éditeur de logiciel de caisse doit savoir avant septembre 2027, écrit par des gens qui construisent
          l&apos;intégration. Utile même si vous ne nous appelez jamais.
        </p>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {ARTICLES.map((a) => (
            <article key={a.slug} className="flex flex-col rounded-3xl bg-paper-2 p-7">
              <p className="text-[14px] text-ink-2">
                {readableDate(a.published)}. {a.minutes} min de lecture
              </p>
              <h2 className="h-small mt-3 text-[24px]">
                <Link href={`/blog/${a.slug}`} className="hover:text-indigo">
                  {a.title}
                </Link>
              </h2>
              <p className="mt-3 flex-1 text-[15.5px] leading-relaxed text-ink-2">{a.lead}</p>
              <Link href={`/blog/${a.slug}`} className="mt-6 inline-block font-semibold text-indigo hover:text-indigo-deep">
                Lire l&apos;article
              </Link>
            </article>
          ))}
        </div>
      </section>
      <FinalCta source="blog-index" />
    </>
  );
}
