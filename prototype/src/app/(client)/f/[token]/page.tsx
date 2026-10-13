"use client";
import { use, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Company, Sale } from "@/lib/types";
import { computeTotals, eur, fmtDate, formatSiren, lineTTC } from "@/lib/format";
import { lastSiren, loadCompanies, saveCompany, saveInvoice, touchCompany } from "@/lib/local";
import { CompanySearch } from "@/components/CompanySearch";
import { MobileHeader } from "@/components/MobileHeader";

type Phase = "loading" | "missing" | "form" | "sending" | "done";

const sendingSteps = ["Création de la facture", "Envoi à votre plateforme"];

export default function ClientInvoicePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [sale, setSale] = useState<Sale | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [saved, setSaved] = useState<Company[]>([]);
  const [selected, setSelected] = useState<Company | null>(null);
  const [searching, setSearching] = useState(false);
  const [remember, setRemember] = useState(true);
  const [otherAddress, setOtherAddress] = useState(false);
  const [delivery, setDelivery] = useState("");
  const [showLines, setShowLines] = useState(false);
  const [error, setError] = useState("");
  const [sendStep, setSendStep] = useState(0);
  const identified = useRef<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const scanKey = `formeb.scanned.${token}`;
        const already = sessionStorage.getItem(scanKey);
        const res = already
          ? await fetch(`/api/sales/${token}`, { cache: "no-store" })
          : await fetch(`/api/sales/${token}/scan`, { method: "POST" });
        if (!res.ok) {
          if (alive) setPhase("missing");
          return;
        }
        sessionStorage.setItem(scanKey, "1");
        const s = (await res.json()) as Sale;
        if (!alive) return;
        setSale(s);
        const list = loadCompanies();
        setSaved(list);
        if (s.invoice) {
          setPhase("done");
          return;
        }
        const last = lastSiren();
        setSelected(list.find((c) => c.siren === last) ?? list[0] ?? null);
        setSearching(list.length === 0);
        setPhase("form");
      } catch {
        if (alive) setPhase("missing");
      }
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  // The register learns which company was picked, pending confirmation.
  useEffect(() => {
    if (phase !== "form" || !selected || identified.current === selected.siren) return;
    identified.current = selected.siren;
    fetch(`/api/sales/${token}/identify`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(selected),
    }).catch(() => null);
  }, [selected, phase, token]);

  // Rotate the sending messages.
  useEffect(() => {
    if (phase !== "sending") return;
    setSendStep(0);
    const id = setInterval(() => setSendStep((s) => Math.min(s + 1, sendingSteps.length - 1)), 1100);
    return () => clearInterval(id);
  }, [phase]);

  // Follow the invoice until the client's platform has it.
  useEffect(() => {
    if (phase !== "done" || sale?.invoice?.status === "accepted") return;
    const id = setInterval(async () => {
      try {
        const res = await fetch(`/api/sales/${token}`, { cache: "no-store" });
        if (res.ok) setSale((await res.json()) as Sale);
      } catch {
        /* retry */
      }
    }, 1500);
    return () => clearInterval(id);
  }, [phase, token, sale?.invoice?.status]);

  const totals = useMemo(() => (sale ? computeTotals(sale.lines) : null), [sale]);

  const send = async () => {
    if (!selected || !sale || !totals) return;
    setPhase("sending");
    setError("");
    const started = Date.now();
    try {
      const res = await fetch(`/api/sales/${token}/invoice`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          client: selected,
          deliveryAddress: otherAddress ? delivery.trim() : undefined,
          category: sale.lines.some((l) => /location|découpe/i.test(l.label)) ? "mixte" : "biens",
        }),
      });
      const json = (await res.json()) as Sale & { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Envoi impossible");
      if (remember) saveCompany(selected);
      touchCompany(selected.siren);
      if (json.invoice) {
        saveInvoice({
          number: json.invoice.number,
          token,
          merchant: sale.merchant.name,
          total: totals.ttc,
          date: json.invoice.createdAt,
          siren: selected.siren,
        });
      }
      // Let the sending animation breathe so the transition reads.
      await new Promise((r) => setTimeout(r, Math.max(0, 2300 - (Date.now() - started))));
      setSale(json);
      setPhase("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Envoi impossible");
      setPhase("form");
    }
  };

  if (phase === "loading") {
    return (
      <div className="m-page">
        <MobileHeader title="Ma facture" />
        <div className="px-5 pt-4">
          <div className="m-skeleton h-9 w-40" />
          <div className="m-skeleton mt-3 h-6 w-64" />
          <div className="m-skeleton mt-8 h-20 w-full" />
          <div className="m-skeleton mt-8 h-7 w-28" />
          <div className="m-skeleton mt-3 h-24 w-full" />
        </div>
      </div>
    );
  }

  if (phase === "missing" || !sale || !totals) {
    return (
      <div className="m-page">
        <MobileHeader title="Ma facture" />
        <div className="m-rise px-5 pt-10 text-center">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-amber-soft text-[34px] text-amber" aria-hidden>
            ?
          </div>
          <h1 className="m-text-h1 mt-6">Ticket introuvable</h1>
          <p className="m-text-sub mt-2">Ce QR code a expiré.</p>
          <Link href="/scan" className="m-btn m-btn-primary mt-8">
            Scanner un autre ticket
          </Link>
        </div>
      </div>
    );
  }

  if (phase === "sending") {
    return (
      <div className="m-page m-fade flex flex-col items-center justify-center px-8 text-center">
        <div className="m-orbit" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <div key={sendStep} className="m-rise mt-10 text-[22px] font-semibold">
          {sendingSteps[sendStep]}
        </div>
        <p className="mt-2 text-[16px] text-ink-soft">{selected?.name}</p>
      </div>
    );
  }

  if (phase === "done" && sale.invoice) {
    const inv = sale.invoice;
    const received = inv.status === "accepted";
    return (
      <div className="m-page m-fade flex flex-col">
        <div className="flex flex-1 flex-col items-center justify-center px-6 pt-12 text-center">
          <div className="m-check" aria-hidden>
            <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
              <path className="m-check-path" d="M18 33l10 10 20-22" />
            </svg>
          </div>
          <h1 className="m-rise m-text-h1 mt-8" style={{ animationDelay: "250ms" }}>
            Facture envoyée
          </h1>
          <div className="m-rise mt-3 text-[34px] font-bold tabular-nums tracking-tight" style={{ animationDelay: "350ms" }}>
            {eur(totals.ttc)}
          </div>
          <p className="m-rise mt-2 text-[17px] text-ink-soft" style={{ animationDelay: "420ms" }}>
            {inv.client.name}
            <br />
            {sale.merchant.name} · {fmtDate(inv.createdAt)}
          </p>

          <div
            className={`m-rise mt-8 flex items-center gap-2.5 rounded-full px-4 py-2 text-[15px] font-medium transition-colors duration-500 ${
              received ? "bg-green-soft text-green" : "bg-cobalt-soft text-cobalt-deep"
            }`}
            style={{ animationDelay: "600ms" }}
            aria-live="polite"
          >
            {received ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
                Reçue par votre logiciel de facturation
              </>
            ) : (
              <>
                <span className="m-dots" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                En route vers votre logiciel de facturation
              </>
            )}
          </div>
        </div>

        <div className="m-rise grid gap-2 px-5 pb-8 pt-6" style={{ animationDelay: "700ms" }}>
          <Link href={`/facture/${token}`} className="m-btn m-btn-primary">
            Voir la facture
          </Link>
          <Link href="/scan" className="m-btn m-btn-ghost">
            Terminé
          </Link>
        </div>
      </div>
    );
  }

  const choices = [...(selected && !saved.some((c) => c.siren === selected.siren) ? [selected] : []), ...saved];

  return (
    <div className="m-page">
      <MobileHeader title="Ma facture" action={{ href: "/entreprises", label: "Mes entreprises" }} />

      <div className="m-rise px-5 pb-36 pt-2">
        <div className="text-[15px] font-medium text-ink-soft">
          {sale.merchant.name} · {fmtDate(sale.createdAt)}
        </div>
        <div className="mt-1 text-[40px] font-bold leading-none tabular-nums tracking-tight">{eur(totals.ttc)}</div>
        <button
          type="button"
          onClick={() => setShowLines((v) => !v)}
          aria-expanded={showLines}
          className="m-press mt-3 inline-flex items-center gap-1.5 rounded-full py-1 text-[16px] font-semibold text-cobalt"
        >
          {showLines ? "Masquer le détail" : `${sale.lines.length} article${sale.lines.length > 1 ? "s" : ""}, voir le détail`}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform ${showLines ? "rotate-180" : ""}`}
            aria-hidden
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {showLines && (
          <ul className="m-card m-rise mt-3 divide-y divide-line px-5">
            {sale.lines.map((l) => (
              <li key={l.label} className="flex justify-between gap-3 py-3 text-[16px]">
                <span className="truncate">
                  {l.qty} × {l.label}
                </span>
                <span className="shrink-0 tabular-nums">{eur(lineTTC(l))}</span>
              </li>
            ))}
            <li className="flex justify-between py-3 text-[15px] text-ink-soft">
              <span>dont TVA</span>
              <span className="tabular-nums">{eur(totals.tva)}</span>
            </li>
          </ul>
        )}

        <h2 className="m-text-title mt-9">Facturer à</h2>

        {searching ? (
          <div className="m-rise mt-4">
            <CompanySearch
              onPick={(c) => {
                setSelected(c);
                setSearching(false);
              }}
              autoFocus
            />
            {saved.length > 0 && (
              <button type="button" onClick={() => setSearching(false)} className="m-press mt-4 w-full rounded-full py-3 text-[17px] font-semibold text-cobalt">
                Annuler
              </button>
            )}
          </div>
        ) : (
          <>
            <ul className="mt-4 space-y-3">
              {choices.map((c, i) => {
                const on = selected?.siren === c.siren;
                const fresh = !saved.some((s) => s.siren === c.siren);
                return (
                  <li key={c.siren} className="m-rise" style={{ animationDelay: `${i * 60}ms` }}>
                    <div
                      role="radio"
                      aria-checked={on}
                      tabIndex={0}
                      onClick={() => setSelected(c)}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected(c)}
                      className={`m-card m-press flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left transition-[box-shadow] duration-200 ${
                        on ? "shadow-[0_0_0_2px_var(--cobalt),0_16px_32px_-20px_rgba(43,79,214,0.6)]" : ""
                      }`}
                    >
                      <span className={`m-radio ${on ? "is-on" : ""}`} aria-hidden>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12.5l4.5 4.5L19 7.5" />
                        </svg>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[18px] font-semibold">{c.name}</span>
                        <span className="block truncate text-[15px] text-ink-soft">
                          {c.city} · {formatSiren(c.siren)}
                        </span>
                        {fresh && on && (
                          <label className="mt-3 flex items-center gap-2.5 text-[16px]" onClick={(e) => e.stopPropagation()}>
                            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-5 accent-cobalt" />
                            Retenir pour la prochaine fois
                          </label>
                        )}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={() => setSearching(true)}
              className="m-press mt-3 flex w-full items-center gap-4 rounded-[22px] border-2 border-dashed border-line px-5 py-4 text-left text-[18px] font-semibold text-cobalt"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-cobalt-soft text-[20px] leading-none" aria-hidden>
                +
              </span>
              Une autre entreprise
            </button>

            <div className="mt-8">
              <label className="flex cursor-pointer items-center justify-between gap-3 text-[17px]">
                <span>Livrer à une autre adresse</span>
                <span className={`m-switch ${otherAddress ? "is-on" : ""}`}>
                  <input type="checkbox" checked={otherAddress} onChange={(e) => setOtherAddress(e.target.checked)} className="sr-only" />
                </span>
              </label>
              {otherAddress && (
                <textarea
                  value={delivery}
                  onChange={(e) => setDelivery(e.target.value)}
                  rows={2}
                  placeholder="Adresse de livraison"
                  className="m-input m-rise mt-3"
                />
              )}
            </div>
          </>
        )}

        {error && <p className="m-rise mt-5 rounded-2xl bg-stamp-soft px-4 py-3 text-[16px] text-stamp">{error}</p>}
      </div>

      {!searching && (
        <div className="m-cta">
          <button type="button" disabled={!selected} onClick={send} className="m-btn m-btn-primary">
            {selected ? "Recevoir ma facture" : "Choisissez une entreprise"}
          </button>
        </div>
      )}
    </div>
  );
}
