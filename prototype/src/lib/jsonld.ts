import { CONTACT, SITE_DESCRIPTION, SITE_LANG, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

// Constructeurs schema.org. Les entités se référencent par @id pour que les moteurs
// reconstituent le graphe d'une page à l'autre.

type Json = Record<string, unknown>;

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SOFTWARE_ID = `${SITE_URL}/#software`;

export function organizationSchema(): Json {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    email: CONTACT.email,
    areaServed: ["FR"],
    knowsAbout: ["Facturation électronique", "Factur-X", "Plateformes agréées", "E-reporting", "Logiciels de caisse"],
  };
}

export function websiteSchema(): Json {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: SITE_LANG,
    publisher: { "@id": ORG_ID },
  };
}

export function softwareSchema(): Json {
  return {
    "@type": "SoftwareApplication",
    "@id": SOFTWARE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Module de facturation électronique pour logiciels de caisse",
    operatingSystem: "API web, page mobile sans application",
    inLanguage: SITE_LANG,
    description: SITE_DESCRIPTION,
    publisher: { "@id": ORG_ID },
    featureList: [
      "QR code imprimé sur le ticket de caisse",
      "Identification du client par SIREN avec recherche par nom",
      "Génération Factur-X (profil EN 16931)",
      "Transmission à la plateforme agréée du destinataire",
      "Webhook : vente marquée B2B, sortie de l'e-reporting",
      "Marque blanche pour éditeurs de caisse",
    ],
    offers: { "@type": "Offer", availability: "https://schema.org/PreOrder", url: absoluteUrl("/#liste-attente") },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]): Json {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleSchema(a: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  minutes?: number;
  keywords: string[];
}): Json {
  const url = absoluteUrl(a.path);
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: a.title,
    description: a.description,
    url,
    mainEntityOfPage: url,
    image: [absoluteUrl("/opengraph-image")],
    datePublished: a.datePublished,
    dateModified: a.dateModified ?? a.datePublished,
    inLanguage: SITE_LANG,
    keywords: a.keywords.join(", "),
    timeRequired: a.minutes ? `PT${a.minutes}M` : undefined,
    author: { "@type": "Organization", "@id": ORG_ID, name: SITE_NAME },
    publisher: { "@id": ORG_ID },
    isPartOf: [{ "@id": WEBSITE_ID }, { "@id": `${SITE_URL}/blog#blog` }],
  };
}

export function webPageSchema(p: { name: string; description: string; path: string; type?: "WebPage" | "CollectionPage" }): Json {
  const url = absoluteUrl(p.path);
  return {
    "@type": p.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: p.name,
    description: p.description,
    inLanguage: SITE_LANG,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": SOFTWARE_ID },
  };
}

export function graph(...nodes: Json[]): Json {
  return { "@context": "https://schema.org", "@graph": nodes };
}
