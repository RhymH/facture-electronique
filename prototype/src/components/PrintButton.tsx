"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-md bg-ink px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-black"
    >
      Imprimer ou enregistrer en PDF
    </button>
  );
}
