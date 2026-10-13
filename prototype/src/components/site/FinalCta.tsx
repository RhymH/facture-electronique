import { WaitlistForm } from "./WaitlistForm";

/** Le bloc de fin de page : la liste d'attente, sur fond encre. */
export function FinalCta({ source }: { source: string }) {
  return (
    <section id="liste-attente" className="scroll-mt-20 bg-pos-bg text-pos-text">
      <div className="container grid gap-10 py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-28">
        <div>
          <h2 className="h-section text-white">Les premières intégrations ouvrent avant l&apos;été 2027.</h2>
          <p className="mt-5 max-w-[48ch] text-[18px] leading-relaxed text-pos-muted">
            Laissez un téléphone ou un e-mail. On vous rappelle pour regarder ensemble ce que votre caisse envoie déjà, et
            ce qu&apos;il manque pour septembre 2027.
          </p>
        </div>
        <div className="rounded-3xl bg-white p-6 text-ink sm:p-8">
          <WaitlistForm source={source} compact />
        </div>
      </div>
    </section>
  );
}
