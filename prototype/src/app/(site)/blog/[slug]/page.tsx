import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Faq } from "@/components/site/Faq";
import { FinalCta } from "@/components/site/FinalCta";
import { ARTICLES, articleBySlug, lastModified, readableDate, relatedArticles } from "@/content/articles";
import { articleSchema, faqSchema, graph } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

// Les articles vivent dans le code : tout est connu au build, un slug inconnu est un vrai 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) return {};
  return pageMetadata({
    title: article.seoTitle,
    description: article.description,
    path: `/blog/${article.slug}`,
    keywords: article.keywords,
    type: "article",
    publishedTime: article.published,
    modifiedTime: lastModified(article),
    section: "Blog",
    tags: article.keywords,
    // Au-delà de 48 caractères, le suffixe pousserait la fin du titre hors des résultats.
    absoluteTitle: article.seoTitle.length > 48,
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) notFound();

  const path = `/blog/${article.slug}`;
  const related = relatedArticles(article);
  const { Body } = article;

  return (
    <>
      <JsonLd
        data={graph(
          articleSchema({
            title: article.title,
            description: article.description,
            path,
            datePublished: article.published,
            dateModified: lastModified(article),
            minutes: article.minutes,
            keywords: article.keywords,
          }),
          ...(article.faq.length ? [faqSchema(article.faq)] : []),
        )}
      />

      <header className="container pt-10 lg:pt-14">
        <Breadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: article.title, path }]} />
        <h1 className="h-display mt-8 max-w-[22ch] text-[clamp(34px,5vw,60px)]">{article.title}</h1>
        <p className="lead mt-6 max-w-[60ch]">{article.lead}</p>
        <p className="mt-6 text-[14.5px] text-ink-2">
          Publié le <time dateTime={article.published}>{readableDate(article.published)}</time>
          {article.updated && article.updated !== article.published && (
            <>
              , mis à jour le <time dateTime={article.updated}>{readableDate(article.updated)}</time>
            </>
          )}
          . {article.minutes} minutes de lecture.
        </p>
      </header>

      <div className="container grid gap-12 py-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 lg:py-16">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <details className="rounded-2xl bg-paper-2 p-4 lg:bg-transparent lg:p-0" open>
            <summary className="cursor-pointer font-headline text-[15px] font-bold">Sommaire</summary>
            <ol className="toc mt-3 border-l border-line text-[14.5px]">
              {article.toc.map((entry) => (
                <li key={entry.id}>
                  <a href={`#${entry.id}`}>{entry.title}</a>
                </li>
              ))}
              {article.faq.length > 0 && (
                <li>
                  <a href="#questions-frequentes">Questions fréquentes</a>
                </li>
              )}
            </ol>
          </details>
          <div className="mt-8 hidden rounded-2xl bg-indigo-soft p-5 lg:block">
            <p className="font-semibold leading-snug">Vous éditez un logiciel de caisse ?</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">
              On construit le module qui fait tout ça derrière deux appels d&apos;API.
            </p>
            <Link href="/#liste-attente" className="btn btn-primary btn-sm mt-4">
              Rejoindre la liste d&apos;attente
            </Link>
          </div>
        </aside>

        <div className="min-w-0 max-w-[46rem]">
          <article className="prose">
            <Body />
          </article>

          <div className="mt-14 rounded-3xl bg-pos-bg p-7 text-pos-text sm:p-9">
            <p className="h-section text-[30px] text-white">Voir ce que ça donne dans votre caisse.</p>
            <p className="mt-3 max-w-[50ch] text-[16px] leading-relaxed text-pos-muted">
              Trente minutes en visio : vous nous montrez ce que votre caisse envoie déjà, on vous montre le parcours du
              client avec le QR code sur votre ticket. Ensuite, si ça vous parle, une intégration pilote gratuite.
            </p>
            <Link href="/#liste-attente" className="btn btn-on-ink mt-6">
              Rejoindre la liste d&apos;attente
            </Link>
          </div>

          {article.faq.length > 0 && (
            <section id="questions-frequentes" className="mt-14 scroll-mt-24">
              <h2 className="h-section mb-5 text-[30px]">Questions fréquentes</h2>
              <Faq items={article.faq} />
            </section>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-line bg-paper-2 py-16">
          <div className="container">
            <h2 className="h-section text-[30px]">À lire ensuite</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {related.map((a) => (
                <article key={a.slug} className="rounded-3xl bg-white p-7 ring-1 ring-line">
                  <p className="text-[14px] text-ink-2">{a.minutes} min de lecture</p>
                  <h3 className="h-small mt-3">
                    <Link href={`/blog/${a.slug}`} className="hover:text-indigo">
                      {a.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">{a.lead}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <FinalCta source={`blog-${article.slug}`} />
    </>
  );
}
