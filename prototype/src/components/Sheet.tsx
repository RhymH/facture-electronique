"use client";
import { useEffect } from "react";

export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="sheet-root" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="sheet-backdrop" aria-label="Fermer" onClick={onClose} />
      <div className="sheet-panel">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-line" aria-hidden />
        {title && <h2 className="m-text-title mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
