import type { ReactNode } from "react";

/**
 * Un article du blog. Les articles vivent dans le code (un fichier par article),
 * sont relus comme du code et prérendus. Le registre `index.ts` est la seule liste
 * lue par les pages, le sitemap et les liens « À lire ensuite ».
 */
export interface Article {
  /** /blog/<slug>. Ne change jamais une fois publié. */
  slug: string;
  /** <h1>, écrit pour un lecteur. */
  title: string;
  /** <title> : 60 caractères max, requête cible en premier. */
  seoTitle: string;
  /** Meta description : 140 à 160 caractères. */
  description: string;
  /** Chapeau sous le titre et sur les cartes. */
  lead: string;
  /** AAAA-MM-JJ */
  published: string;
  /** Date de la dernière vraie révision du contenu. */
  updated?: string;
  keywords: string[];
  minutes: number;
  /** Les <h2 id> du corps, dans l'ordre : sommaire et ancres. */
  toc: { id: string; title: string }[];
  /** Affichées en fin d'article ET en JSON-LD FAQPage, à partir des mêmes textes. */
  faq: { q: string; a: string }[];
  related: string[];
  Body: () => ReactNode;
}
