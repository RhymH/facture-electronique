import type { Article } from "./type";
import { article as integration } from "./articles/facturation-electronique-b2b-integration-logiciel-de-caisse";
import { article as api } from "./articles/api-facturation-electronique-plateforme-agreee-factur-x";

/** Le registre, dans l'ordre de présentation. Ajouter un article ici suffit. */
export const ARTICLES: Article[] = [integration, api];

export function articleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function relatedArticles(article: Article, count = 2): Article[] {
  const declared = article.related
    .map(articleBySlug)
    .filter((a): a is Article => a !== undefined && a.slug !== article.slug);
  const padding = ARTICLES.filter((a) => a.slug !== article.slug && !declared.includes(a));
  return [...declared, ...padding].slice(0, count);
}

export function lastModified(article: Article): string {
  return article.updated ?? article.published;
}

export function newestArticleDate(): string {
  return ARTICLES.map(lastModified).sort().at(-1) ?? "2026-10-13";
}

/** « 13 octobre 2026 », heure de Paris. */
export function readableDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  });
}
