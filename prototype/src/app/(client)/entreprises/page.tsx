"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Company } from "@/lib/types";
import { eur, fmtDate, formatSiren } from "@/lib/format";
import { invoicesFor, loadCompanies, removeCompany, saveCompany, type LocalInvoice } from "@/lib/local";
import { CompanySearch } from "@/components/CompanySearch";
import { MobileHeader } from "@/components/MobileHeader";
import { Sheet } from "@/components/Sheet";

export default function CompaniesPage() {
  const [list, setList] = useState<Company[]>([]);
  const [adding, setAdding] = useState(false);
  const [open, setOpen] = useState<Company | null>(null);
  const [confirm, setConfirm] = useState<Company | null>(null);
  const [invoices, setInvoices] = useState<LocalInvoice[]>([]);
  const [flash, setFlash] = useState("");

  useEffect(() => {
    setList(loadCompanies());
  }, []);

  const show = (c: Company) => {
    setInvoices(invoicesFor(c.siren));
    setOpen(c);
  };

  const add = (c: Company) => {
    setList(saveCompany(c));
    setAdding(false);
    setFlash(`${c.name} retenue.`);
  };

  const remove = (c: Company) => {
    setList(removeCompany(c.siren));
    setConfirm(null);
    setOpen(null);
    setFlash(`${c.name} retirée.`);
  };

  return (
    <div className="m-page">
      <MobileHeader title="" back={{ href: "/scan", label: "Retour" }} />

      <div className="m-rise px-5 pb-12 pt-2">
        <h1 className="m-text-h1">Mes entreprises</h1>
        <p className="m-text-sub mt-2">Retenues sur ce téléphone.</p>

        {flash && (
          <p key={flash} className="m-rise mt-5 rounded-2xl bg-green-soft px-4 py-3 text-[16px] font-medium text-green">
            {flash}
          </p>
        )}

        {adding ? (
          <div className="m-rise mt-6">
            <CompanySearch onPick={add} autoFocus />
            <button type="button" onClick={() => setAdding(false)} className="m-press mt-4 w-full rounded-full py-3 text-[17px] font-semibold text-cobalt">
              Annuler
            </button>
          </div>
        ) : (
          <>
            {list.length > 0 ? (
              <ul className="mt-6 space-y-3">
                {list.map((c, i) => (
                  <li key={c.siren} className="m-rise" style={{ animationDelay: `${i * 60}ms` }}>
                    <button type="button" onClick={() => show(c)} className="m-card m-press flex w-full items-center gap-4 px-5 py-4 text-left">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-cobalt-soft text-[18px] font-bold text-cobalt">
                        {c.name.slice(0, 1)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[18px] font-semibold">{c.name}</span>
                        <span className="block truncate text-[15px] text-ink-soft">{c.city}</span>
                      </span>
                      <Chevron />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="m-card mt-6 px-5 py-6 text-center text-[16px] text-muted">Aucune entreprise pour l&apos;instant.</p>
            )}
            <button
              type="button"
              onClick={() => {
                setFlash("");
                setAdding(true);
              }}
              className="m-btn m-btn-primary mt-6"
            >
              Ajouter une entreprise
            </button>
          </>
        )}
      </div>

      <Sheet open={!!open && !confirm} onClose={() => setOpen(null)}>
        {open && (
          <div>
            <div className="text-[22px] font-semibold leading-tight">{open.name}</div>
            <div className="mt-1 text-[15px] text-ink-soft">
              SIREN {formatSiren(open.siren)}
              <br />
              {[open.address, open.postalCode, open.city].filter(Boolean).join(", ")}
            </div>

            <div className="mt-6 text-[14px] font-semibold text-muted">Dernière facture</div>
            {invoices.length > 0 ? (
              <div className="m-card mt-2 px-5 py-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-[18px] font-semibold">{invoices[0].merchant}</span>
                  <span className="text-[20px] font-bold tabular-nums">{eur(invoices[0].total)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[15px] text-ink-soft">
                  <span>
                    {invoices[0].number} · {fmtDate(invoices[0].date)}
                  </span>
                  {invoices[0].token && (
                    <Link href={`/facture/${invoices[0].token}`} className="font-semibold text-cobalt">
                      Voir
                    </Link>
                  )}
                </div>
                {invoices.length > 1 && (
                  <div className="mt-3 border-t border-line pt-3 text-[14px] text-muted">
                    {invoices.length - 1} autre{invoices.length > 2 ? "s" : ""} facture{invoices.length > 2 ? "s" : ""} chez {invoices[0].merchant}
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-2 text-[16px] text-ink-soft">Aucune facture pour l&apos;instant.</p>
            )}

            <div className="mt-6 grid gap-2">
              <button type="button" onClick={() => setConfirm(open)} className="m-btn m-btn-danger-soft">
                Retirer cette entreprise
              </button>
              <button type="button" onClick={() => setOpen(null)} className="m-btn m-btn-ghost">
                Fermer
              </button>
            </div>
          </div>
        )}
      </Sheet>

      <Sheet open={!!confirm} onClose={() => setConfirm(null)}>
        {confirm && (
          <div className="text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-stamp-soft text-stamp" aria-hidden>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
              </svg>
            </div>
            <div className="mt-4 text-[22px] font-semibold leading-tight">Retirer {confirm.name} ?</div>
            <p className="mt-2 text-[16px] text-ink-soft">Elle ne sera plus proposée au prochain scan.</p>
            <div className="mt-6 grid gap-2">
              <button type="button" onClick={() => remove(confirm)} className="m-btn m-btn-danger">
                Retirer
              </button>
              <button type="button" onClick={() => setConfirm(null)} className="m-btn m-btn-ghost">
                Annuler
              </button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}

function Chevron() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted" aria-hidden>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}
