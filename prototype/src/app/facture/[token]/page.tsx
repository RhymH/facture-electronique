import Link from "next/link";
import { notFound } from "next/navigation";
import { getSale } from "@/lib/store";
import { computeTotals, eur, fmtDate, formatSiren, pct } from "@/lib/format";
import { PrintButton } from "@/components/PrintButton";

export const dynamic = "force-dynamic";

const categories = { biens: "Livraison de biens", services: "Prestation de services", mixte: "Opération mixte (biens et services)" };

export default async function InvoicePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { token } = await params;
  const fromCaisse = (await searchParams).from === "caisse";
  const sale = getSale(token);
  if (!sale?.invoice) notFound();
  const inv = sale.invoice;
  const t = computeTotals(sale.lines);
  const m = sale.merchant;
  const c = inv.client;

  return (
    <main className="min-h-dvh bg-counter py-8 print:bg-white print:py-0">
      <div className="no-print mx-auto mb-4 flex w-[210mm] max-w-full items-center justify-between px-4 text-[13px]">
        <Link href={fromCaisse ? "/caisse" : `/f/${token}`} className="font-medium text-cobalt">
          {fromCaisse ? "Retour à la caisse" : "Retour"}
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-muted">Factur-X : ce PDF embarque le XML CII (profil EN 16931).</span>
          <PrintButton />
        </div>
      </div>

      <article className="mx-auto w-[210mm] max-w-full bg-white px-[18mm] py-[16mm] text-[12.5px] leading-[1.45] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.5)] print:shadow-none">
        <header className="flex items-start justify-between gap-8">
          <div>
            <div className="text-[18px] font-bold">{m.name}</div>
            <div>{m.address}</div>
            <div>
              {m.postalCode} {m.city}
            </div>
            <div className="mt-1 text-ink-soft">SIREN {formatSiren(m.siren)} · TVA {m.vat}</div>
          </div>
          <div className="text-right">
            <div className="font-receipt text-[22px] font-bold">FACTURE</div>
            <div className="font-receipt text-[15px]">{inv.number}</div>
            <div className="mt-2">Date : {fmtDate(inv.createdAt)}</div>
            <div>Réf. ticket : {sale.number}</div>
          </div>
        </header>

        <section className="mt-10 grid grid-cols-2 gap-8">
          <div className="rounded-md border border-line p-4">
            <div className="mb-1 text-[11px] font-semibold text-muted">Facturé à</div>
            <div className="text-[14px] font-bold">{c.name}</div>
            <div>{c.address}</div>
            <div>
              {c.postalCode} {c.city}
            </div>
            <div className="mt-1 text-ink-soft">SIREN {formatSiren(c.siren)}</div>
            {c.vat && <div className="text-ink-soft">TVA {c.vat}</div>}
          </div>
          <div className="rounded-md border border-line p-4">
            <div className="mb-1 text-[11px] font-semibold text-muted">Livraison</div>
            <div>{inv.deliveryAddress ?? "Retrait en magasin, identique au siège du client."}</div>
            <div className="mt-3 text-[11px] font-semibold text-muted">Catégorie d&apos;opération</div>
            <div>{categories[inv.category]}</div>
          </div>
        </section>

        <table className="mt-8 w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-ink text-left text-[11.5px]">
              <th className="py-2 font-semibold">Désignation</th>
              <th className="py-2 text-right font-semibold">Qté</th>
              <th className="py-2 text-right font-semibold">PU HT</th>
              <th className="py-2 text-right font-semibold">TVA</th>
              <th className="py-2 text-right font-semibold">Total HT</th>
            </tr>
          </thead>
          <tbody>
            {sale.lines.map((l) => (
              <tr key={l.label} className="border-b border-line">
                <td className="py-2">{l.label}</td>
                <td className="py-2 text-right tabular-nums">{l.qty}</td>
                <td className="py-2 text-right tabular-nums">{eur(l.unitPriceHT)}</td>
                <td className="py-2 text-right tabular-nums">{pct(l.vatRate)}</td>
                <td className="py-2 text-right tabular-nums">{eur(l.qty * l.unitPriceHT)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <section className="mt-6 flex justify-between gap-8">
          <div className="text-[11.5px] text-ink-soft">
            <div className="font-semibold text-ink">Ventilation de la TVA</div>
            <table className="mt-1">
              <tbody>
                {t.byRate.map((r) => (
                  <tr key={r.rate}>
                    <td className="pr-4">Taux {pct(r.rate)}</td>
                    <td className="pr-4 text-right tabular-nums">base {eur(r.ht)}</td>
                    <td className="text-right tabular-nums">TVA {eur(r.tva)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <table className="w-[240px]">
            <tbody>
              <tr>
                <td className="py-0.5">Total HT</td>
                <td className="py-0.5 text-right tabular-nums">{eur(t.ht)}</td>
              </tr>
              <tr>
                <td className="py-0.5">Total TVA</td>
                <td className="py-0.5 text-right tabular-nums">{eur(t.tva)}</td>
              </tr>
              <tr className="border-t-2 border-ink text-[15px] font-bold">
                <td className="pt-1.5">Total TTC</td>
                <td className="pt-1.5 text-right tabular-nums">{eur(t.ttc)}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <footer className="mt-10 border-t border-line pt-4 text-[11px] leading-relaxed text-ink-soft">
          <p>
            Réglée le {fmtDate(sale.createdAt)} par {sale.paidWith.toLowerCase()} en magasin. Aucune somme n&apos;est due. TVA d&apos;après les débits : non.
          </p>
          <p>
            En cas de retard de paiement : pénalités au taux légal en vigueur et indemnité forfaitaire de recouvrement de 40 €. Pas d&apos;escompte pour paiement anticipé.
          </p>
          <p className="mt-2 font-receipt text-muted">
            Document Factur-X EN 16931 · fichier factur-x.xml (CII) embarqué dans le PDF/A-3 · transmis via plateforme agréée
          </p>
        </footer>
      </article>
    </main>
  );
}
