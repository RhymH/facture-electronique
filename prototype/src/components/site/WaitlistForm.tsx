"use client";
import { useId, useState } from "react";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "done" } | { kind: "error"; message: string };

/**
 * Le formulaire de liste d'attente : un seul champ, téléphone ou e-mail, et le nom
 * du logiciel en option. Envoie à /api/waitlist, qui nous prévient par e-mail.
 */
export function WaitlistForm({ source, compact = false }: { source: string; compact?: boolean }) {
  const id = useId();
  const [contact, setContact] = useState("");
  const [software, setSoftware] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  const looksLikePhone = /^[\s+0-9().-]{6,}$/.test(contact.trim());

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (form.get("website")) return; // piège à robots
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: contact.trim(), software: software.trim(), source }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setState({ kind: "error", message: data.error ?? "L'envoi a échoué. Réessayez dans un instant." });
        return;
      }
      setState({ kind: "done" });
    } catch {
      setState({ kind: "error", message: "Pas de réseau. Vérifiez la connexion et réessayez." });
    }
  }

  if (state.kind === "done") {
    return (
      <div
        role="status"
        className="flex items-start gap-4 rounded-2xl bg-mint-soft p-5 text-ink"
      >
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-mint text-white">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
            <path d="M3.5 9.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <p className="text-[18px] font-semibold">C&apos;est noté.</p>
          <p className="mt-1 text-[15.5px] leading-relaxed text-ink-2">
            On vous contacte dès que les premières intégrations ouvrent. Pas de newsletter, pas de relance automatique.
          </p>
        </div>
      </div>
    );
  }

  const sending = state.kind === "sending";

  return (
    <form onSubmit={submit} className="w-full" noValidate>
      <div className={`flex flex-col gap-3 ${compact ? "" : "sm:flex-row"}`}>
        <div className="flex-1">
          <label htmlFor={`${id}-contact`} className="sr-only">
            Téléphone ou e-mail
          </label>
          <input
            id={`${id}-contact`}
            name="contact"
            className="field"
            placeholder="Téléphone ou e-mail"
            autoComplete="email"
            inputMode={looksLikePhone ? "tel" : "email"}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            aria-invalid={state.kind === "error" ? true : undefined}
            aria-describedby={state.kind === "error" ? `${id}-error` : undefined}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-lg" disabled={sending}>
          {sending ? "Envoi…" : "Me prévenir à l'ouverture"}
        </button>
      </div>
      <div className="mt-3">
        <label htmlFor={`${id}-software`} className="sr-only">
          Votre logiciel de caisse (facultatif)
        </label>
        <input
          id={`${id}-software`}
          name="software"
          className="field h-[48px] text-[15.5px]"
          placeholder="Votre logiciel de caisse (facultatif)"
          autoComplete="organization"
          value={software}
          onChange={(e) => setSoftware(e.target.value)}
        />
      </div>
      {/* Champ invisible : un robot le remplit, un humain ne le voit pas. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {state.kind === "error" && (
        <p id={`${id}-error`} role="alert" className="mt-3 text-[14.5px] font-medium text-stamp">
          {state.message}
        </p>
      )}
      <p className="mt-3 text-[13.5px] leading-snug text-muted">
        Un seul message de notre part, pour vous proposer une intégration. Vos coordonnées ne vont nulle part ailleurs.
      </p>
    </form>
  );
}
