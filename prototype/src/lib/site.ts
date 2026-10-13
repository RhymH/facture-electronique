// Identité du site : une seule source pour les métadonnées, le JSON-LD, le sitemap et le pied de page.
// Le nom est provisoire : changez-le ici, tout suit.

export const SITE_NAME = "Factick";
export const SITE_TAGLINE = "La facture électronique B2B, en scannant le ticket de caisse";
export const SITE_DESCRIPTION =
  "Factick est un module en marque blanche pour les éditeurs de logiciels de caisse : un QR code sur le ticket, le client professionnel saisit son SIREN, la facture Factur-X part vers sa plateforme agréée et la vente est marquée B2B dans la caisse. Prêt avant septembre 2027.";
export const SITE_LOCALE = "fr_FR";
export const SITE_LANG = "fr";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? process.env.PUBLIC_BASE_URL ?? "https://factick.fr")
  .trim()
  .replace(/\/+$/, "");

export const CONTACT = {
  email: "contact@factick.fr",
  country: "FR",
};

export const DEFAULT_OG_IMAGE = "/opengraph-image";

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? SITE_URL : `${SITE_URL}${clean}`;
}
