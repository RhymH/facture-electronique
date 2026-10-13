import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_LOCALE, SITE_NAME, absoluteUrl } from "@/lib/site";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  /** Titre tel quel, sans le suffixe « | Factick ». */
  absoluteTitle?: boolean;
};

/** Métadonnées complètes d'une page indexable : canonical, Open Graph, carte Twitter. */
export function pageMetadata(input: PageMetaInput): Metadata {
  const url = absoluteUrl(input.path);
  const image = absoluteUrl(input.image ?? DEFAULT_OG_IMAGE);
  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical: url, languages: { "fr-FR": url, "x-default": url } },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: input.type ?? "website",
      images: [{ url: image, alt: input.imageAlt ?? input.title, width: 1200, height: 630 }],
      ...(input.type === "article"
        ? {
            publishedTime: input.publishedTime,
            modifiedTime: input.modifiedTime ?? input.publishedTime,
            section: input.section,
            tags: input.tags,
          }
        : {}),
    },
    twitter: { card: "summary_large_image", title: input.title, description: input.description, images: [image] },
  };
}

/** Pages de la démo : jamais indexées. */
export const NOINDEX: Metadata = { robots: { index: false, follow: false } };
