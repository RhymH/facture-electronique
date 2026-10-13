"use client";
import { useEffect, useRef, useState } from "react";
import type { Company } from "@/lib/types";
import { formatSiren } from "@/lib/format";

export function CompanySearch({ onPick, autoFocus = false }: { onPick: (c: Company) => void; autoFocus?: boolean }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<string | null>(null);
  const seq = useRef(0);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults([]);
      return;
    }
    const id = ++seq.current;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/entreprises?q=${encodeURIComponent(term)}`);
        const json = (await res.json()) as Company[];
        if (id !== seq.current) return;
        setResults(json);
        setSource(res.headers.get("x-source"));
      } catch {
        if (id === seq.current) setResults([]);
      } finally {
        if (id === seq.current) setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div>
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          inputMode="search"
          autoComplete="off"
          aria-label="Nom ou SIREN"
          placeholder="Nom ou SIREN"
          className="m-input pl-12"
        />
        {loading && <span className="m-spinner absolute right-4 top-1/2 size-5 -translate-y-1/2" aria-hidden />}
      </div>
      {source === "offline" && <p className="mt-2 px-1 text-[14px] text-amber">Hors ligne : résultats de démonstration.</p>}

      {results.length > 0 && (
        <ul className="m-card mt-3 divide-y divide-line overflow-hidden">
          {results.map((c, i) => (
            <li key={c.siren} className="m-rise" style={{ animationDelay: `${i * 35}ms` }}>
              <button type="button" onClick={() => onPick(c)} className="m-press flex w-full items-center gap-3 px-4 py-4 text-left">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[17px] font-semibold">{c.name}</span>
                  <span className="block truncate text-[15px] text-ink-soft">
                    {[c.postalCode, c.city].filter(Boolean).join(" ")}
                  </span>
                </span>
                <span className="shrink-0 font-receipt text-[14px] text-muted">{formatSiren(c.siren)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {!loading && q.trim().length >= 2 && results.length === 0 && (
        <p className="mt-4 px-1 text-[16px] text-ink-soft">Aucun résultat. Essayez le SIREN.</p>
      )}
    </div>
  );
}
