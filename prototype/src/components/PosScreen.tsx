"use client";
import { useMemo, useState } from "react";
import { products, type Product } from "@/lib/catalog";
import type { SaleLine } from "@/lib/types";
import { computeTotals, eur, pct } from "@/lib/format";

const groups: Product["group"][] = ["Outillage", "Fixation", "Plomberie", "Jardin", "Services"];

export function PosScreen({
  lines,
  onChange,
  onCheckout,
  busy,
  clock,
}: {
  lines: SaleLine[];
  onChange: (lines: SaleLine[]) => void;
  onCheckout: (paidWith: string) => void;
  busy: boolean;
  clock: string;
}) {
  const [group, setGroup] = useState<Product["group"]>("Outillage");
  const totals = useMemo(() => computeTotals(lines), [lines]);

  const add = (p: Product) => {
    const i = lines.findIndex((l) => l.label === p.label);
    if (i >= 0) {
      const next = lines.slice();
      next[i] = { ...next[i], qty: next[i].qty + 1 };
      onChange(next);
    } else {
      onChange([...lines, { label: p.label, qty: 1, unitPriceHT: p.unitPriceHT, vatRate: p.vatRate }]);
    }
  };
  const bump = (idx: number, delta: number) => {
    const next = lines
      .map((l, i) => (i === idx ? { ...l, qty: l.qty + delta } : l))
      .filter((l) => l.qty > 0);
    onChange(next);
  };

  return (
    <div className="flex h-[720px] flex-col overflow-hidden rounded-2xl bg-pos-bg text-pos-text shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)] ring-1 ring-black/40">
      <div className="flex items-center justify-between border-b border-pos-line px-4 py-2.5 text-[12px] text-pos-muted">
        <span>Quincaillerie Martin · Caisse 1 · Vendeur 02</span>
        <span className="tabular-nums">{clock}</span>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_16rem]">
        <div className="flex min-h-0 min-w-0 flex-col border-r border-pos-line">
          <div className="flex flex-wrap gap-1 px-3 pt-3">
            {groups.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGroup(g)}
                className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  g === group ? "bg-pos-text text-pos-bg" : "bg-pos-panel text-pos-muted hover:text-pos-text"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2 p-3">
            {products
              .filter((p) => p.group === group)
              .map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => add(p)}
                  className="flex min-h-[72px] flex-col justify-between rounded-lg bg-pos-panel px-3 py-2.5 text-left transition hover:bg-[#263043] active:scale-[0.98]"
                >
                  <span className="text-[13px] font-medium leading-tight">{p.label}</span>
                  <span className="text-[12px] text-pos-muted">
                    {eur(p.unitPriceHT * (1 + p.vatRate / 100))} <span className="opacity-70">TTC</span>
                  </span>
                </button>
              ))}
          </div>
        </div>

        <div className="flex min-h-0 min-w-0 flex-col">
          <div className="border-b border-pos-line px-3 py-2 text-[12px] text-pos-muted">Ticket en cours</div>
          <ul className="min-h-0 flex-1 overflow-y-auto px-2 py-1">
            {lines.length === 0 && <li className="px-1 py-6 text-center text-[13px] text-pos-muted">Touchez un article.</li>}
            {lines.map((l, i) => (
              <li key={l.label} className="flex items-center gap-1.5 border-b border-pos-line/60 py-2 text-[13px] last:border-0">
                <div className="min-w-0 flex-1">
                  <div className="truncate">{l.label}</div>
                  <div className="text-[11px] text-pos-muted">
                    {eur(l.unitPriceHT * (1 + l.vatRate / 100))} · TVA {pct(l.vatRate)}
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  <button type="button" onClick={() => bump(i, -1)} className="size-6 rounded bg-pos-panel text-pos-muted hover:text-pos-text" aria-label="Retirer un">
                    −
                  </button>
                  <span className="w-5 text-center tabular-nums">{l.qty}</span>
                  <button type="button" onClick={() => bump(i, 1)} className="size-6 rounded bg-pos-panel text-pos-muted hover:text-pos-text" aria-label="Ajouter un">
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-pos-line px-3 py-3">
            <div className="flex justify-between text-[12px] text-pos-muted">
              <span>HT</span>
              <span className="tabular-nums">{eur(totals.ht)}</span>
            </div>
            <div className="flex justify-between text-[12px] text-pos-muted">
              <span>TVA</span>
              <span className="tabular-nums">{eur(totals.tva)}</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-[13px]">Total</span>
              <span className="text-[22px] font-semibold tabular-nums">{eur(totals.ttc)}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={busy || lines.length === 0}
                onClick={() => onCheckout("Carte bancaire")}
                className="rounded-lg bg-cobalt px-3 py-3 text-[14px] font-semibold text-white transition hover:bg-cobalt-deep disabled:opacity-40"
              >
                {busy ? "Impression…" : "Encaisser CB"}
              </button>
              <button
                type="button"
                disabled={busy || lines.length === 0}
                onClick={() => onCheckout("Espèces")}
                className="rounded-lg bg-pos-panel px-3 py-3 text-[14px] font-semibold transition hover:bg-[#263043] disabled:opacity-40"
              >
                Espèces
              </button>
            </div>
            <button type="button" onClick={() => onChange([])} className="mt-2 w-full py-1 text-[12px] text-pos-muted hover:text-pos-text">
              Vider le ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
