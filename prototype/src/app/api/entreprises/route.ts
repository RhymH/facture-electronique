import { NextResponse } from "next/server";
import type { Company } from "@/lib/types";
import { vatFromSiren } from "@/lib/format";

export const dynamic = "force-dynamic";

const offline: Company[] = [
  { siren: "842316759", name: "PLOMBERIE DURAND", address: "14 rue des Artisans", postalCode: "68000", city: "Colmar", vat: "FR37842316759", naf: "43.22A" },
  { siren: "512043687", name: "ELECTRICITE SCHMITT", address: "8 avenue de la Liberté", postalCode: "68100", city: "Mulhouse", vat: "FR28512043687", naf: "43.21A" },
  { siren: "798654120", name: "MENUISERIE KELLER", address: "22 rue du Rhin", postalCode: "68600", city: "Neuf-Brisach", vat: "FR52798654120", naf: "43.32A" },
  { siren: "431275690", name: "PAYSAGES DE LA PLAINE", address: "5 route de Strasbourg", postalCode: "68000", city: "Colmar", vat: "FR21431275690", naf: "81.30Z" },
  { siren: "905412367", name: "BOULANGERIE WEBER", address: "17 Grand-Rue", postalCode: "68140", city: "Munster", vat: "FR48905412367", naf: "10.71C" },
];

interface ApiResult {
  siren: string;
  nom_complet?: string;
  nom_raison_sociale?: string;
  activite_principale?: string;
  siege?: { adresse?: string; numero_voie?: string; type_voie?: string; libelle_voie?: string; code_postal?: string; libelle_commune?: string };
}

export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim();
  if (q.length < 2) return NextResponse.json([]);

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(
      `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(q)}&per_page=8&page=1&etat_administratif=A`,
      { signal: ctrl.signal, headers: { accept: "application/json" }, cache: "no-store" },
    );
    clearTimeout(t);
    if (!res.ok) throw new Error(String(res.status));
    const json = (await res.json()) as { results?: ApiResult[] };
    const items: Company[] = (json.results ?? []).map((r) => {
      const s = r.siege ?? {};
      const street = [s.numero_voie, s.type_voie, s.libelle_voie].filter(Boolean).join(" ");
      return {
        siren: r.siren,
        name: (r.nom_raison_sociale || r.nom_complet || "").toUpperCase(),
        address: street || s.adresse || "",
        postalCode: s.code_postal ?? "",
        city: s.libelle_commune ?? "",
        vat: vatFromSiren(r.siren),
        naf: r.activite_principale,
      };
    });
    return NextResponse.json(items, { headers: { "x-source": "recherche-entreprises" } });
  } catch {
    const digits = q.replace(/\s/g, "");
    const needle = q.toLowerCase();
    const items = offline.filter((c) => c.siren.startsWith(digits) || c.name.toLowerCase().includes(needle) || c.city.toLowerCase().includes(needle));
    return NextResponse.json(items, { headers: { "x-source": "offline" } });
  }
}
