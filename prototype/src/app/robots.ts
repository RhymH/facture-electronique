import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// Les moteurs et assistants IA sont les bienvenus sur le site vitrine. La démo et l'API ne sont pas à indexer.
const DISALLOW = ["/api/", "/demo", "/caisse", "/scan", "/entreprises", "/f/", "/facture/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: DISALLOW }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
