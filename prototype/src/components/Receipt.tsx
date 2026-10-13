"use client";
import type { Sale } from "@/lib/types";
import { computeTotals, eurPlain, fmtDateTime, formatSiren, lineTTC, pct } from "@/lib/format";
import { QrCode } from "./QrCode";

function row(left: string, right: string, width = 32) {
  const space = Math.max(1, width - left.length - right.length);
  return left + " ".repeat(space) + right;
}

export function Receipt({ sale, qrUrl, animate = false }: { sale: Sale; qrUrl: string; animate?: boolean }) {
  const t = computeTotals(sale.lines);
  const m = sale.merchant;
  const invoiced = sale.status === "invoiced" && sale.invoice;

  return (
    <div className={`receipt w-[300px] px-5 pt-6 pb-8 text-[12.5px] leading-[1.45] ${animate ? "receipt-print" : ""}`}>
      <div className="text-center">
        <div className="text-[15px] font-bold uppercase tracking-wide">{m.name}</div>
        <div>{m.address}</div>
        <div>
          {m.postalCode} {m.city}
        </div>
        <div>Tél. {m.phone}</div>
        <div>SIREN {formatSiren(m.siren)}</div>
        <div>TVA {m.vat}</div>
      </div>

      <pre className="mt-4 whitespace-pre font-[inherit]">
        {row(`Ticket ${sale.number}`, sale.register)}
        {"\n"}
        {row(fmtDateTime(sale.createdAt), "Vendeur 02")}
      </pre>

      <div className="my-2 border-t border-dashed border-[#9aa0a6]" />

      <pre className="whitespace-pre-wrap font-[inherit]">
        {sale.lines
          .map((l) => {
            const label = l.label.length > 24 ? l.label.slice(0, 23) + "…" : l.label;
            const first = row(label, `${eurPlain(lineTTC(l))}`);
            const second = `  ${l.qty} x ${eurPlain(l.unitPriceHT * (1 + l.vatRate / 100))}  TVA ${pct(l.vatRate)}`;
            return first + "\n" + second;
          })
          .join("\n")}
      </pre>

      <div className="my-2 border-t border-dashed border-[#9aa0a6]" />

      <pre className="whitespace-pre font-[inherit]">
        {row("Total HT", eurPlain(t.ht))}
        {"\n"}
        {t.byRate.map((r) => row(`TVA ${pct(r.rate)}`, eurPlain(r.tva))).join("\n")}
        {"\n"}
      </pre>
      <pre className="whitespace-pre font-[inherit] text-[15px] font-bold">{row("TOTAL TTC", eurPlain(t.ttc) + " EUR", 27)}</pre>
      <pre className="mt-1 whitespace-pre font-[inherit]">{row(sale.paidWith, eurPlain(t.ttc))}</pre>

      <div className="my-3 border-t border-dashed border-[#9aa0a6]" />

      <div className="relative text-center">
        <div className="text-[13px] font-bold uppercase">Besoin d&apos;une facture ?</div>
        <div className="mt-0.5">Scannez ce code avec votre téléphone, saisissez votre SIREN. C&apos;est tout.</div>
        <div className="mt-3 flex justify-center">
          <QrCode value={qrUrl} size={140} />
        </div>
        <div className="mt-2 text-[10.5px] text-[#555b66]">Valable 30 jours. Un seul client par ticket.</div>
        {invoiced && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="stamp bg-[rgba(255,253,248,0.92)] px-4 py-2 text-[22px] font-bold leading-none">
              Facturé B2B
              <div className="mt-1 text-[12px] font-normal tracking-normal normal-case">{sale.invoice?.number}</div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 text-center text-[11px]">Merci de votre visite</div>
    </div>
  );
}
