import type { MetadataRoute } from "next";
import { ARTICLES, lastModified, newestArticleDate } from "@/content/articles";
import { absoluteUrl } from "@/lib/site";

// lastModified est posé à la main et seulement quand la page change vraiment : c'est le seul
// champ que Google lit, et seulement s'il est vrai. La démo (/demo, /caisse, /scan…) n'y figure pas.
const HOME_UPDATED = "2026-10-13";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), lastModified: HOME_UPDATED, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/blog"), lastModified: newestArticleDate(), changeFrequency: "weekly", priority: 0.8 },
    ...ARTICLES.map((a) => ({
      url: absoluteUrl(`/blog/${a.slug}`),
      lastModified: lastModified(a),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
