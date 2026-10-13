"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import jsQR from "jsqr";
import { MobileHeader } from "@/components/MobileHeader";

type CamState = "idle" | "starting" | "live" | "denied" | "unavailable";

function tokenFromText(text: string): string | null {
  const m = text.match(/\/f\/([A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
}

export default function ScanPage() {
  const router = useRouter();
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [cam, setCam] = useState<CamState>("idle");
  const [note, setNote] = useState("");
  const [secure, setSecure] = useState(true);
  const found = useRef(false);

  useEffect(() => {
    setSecure(window.isSecureContext);
  }, []);

  const go = (token: string) => {
    if (found.current) return;
    found.current = true;
    router.push(`/f/${token}`);
  };

  useEffect(() => {
    if (cam !== "starting") return;
    let stream: MediaStream | null = null;
    let raf = 0;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
        const v = video.current!;
        v.srcObject = stream;
        await v.play();
        setCam("live");
        const c = canvas.current!;
        const ctx = c.getContext("2d", { willReadFrequently: true })!;
        const loop = () => {
          if (v.readyState === v.HAVE_ENOUGH_DATA) {
            c.width = v.videoWidth;
            c.height = v.videoHeight;
            ctx.drawImage(v, 0, 0);
            const img = ctx.getImageData(0, 0, c.width, c.height);
            const code = jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" });
            if (code?.data) {
              const t = tokenFromText(code.data);
              if (t) {
                go(t);
                return;
              }
              setNote("Ce n'est pas un ticket.");
            }
          }
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      } catch (e) {
        setCam(e instanceof DOMException && e.name === "NotAllowedError" ? "denied" : "unavailable");
      }
    })();
    return () => {
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cam === "starting"]);

  const openLatest = async () => {
    const res = await fetch("/api/sales/latest", { cache: "no-store" });
    if (!res.ok) {
      setNote("Aucun ticket encaissé pour l'instant.");
      return;
    }
    go((await res.json()).token);
  };

  return (
    <div className="m-page">
      <MobileHeader title="Ma facture" action={{ href: "/entreprises", label: "Mes entreprises" }} />

      <div className="m-rise px-5 pb-10 pt-2">
        <h1 className="m-text-h1">Scannez le ticket</h1>
        <p className="m-text-sub mt-2">Le QR code est en bas du ticket.</p>

        <div className="relative mt-6 aspect-[4/5] overflow-hidden rounded-[28px] bg-ink shadow-[0_24px_48px_-24px_rgba(28,36,51,0.6)]">
          <video ref={video} className={`h-full w-full object-cover ${cam === "live" ? "" : "hidden"}`} playsInline muted />
          <canvas ref={canvas} className="hidden" />
          {cam === "live" ? (
            <>
              <div className="scan-corners pointer-events-none absolute inset-10" />
              <div className="scan-sweep pointer-events-none absolute left-10 right-10 h-[3px] rounded-full bg-white shadow-[0_0_16px_4px_rgba(255,255,255,0.7)]" />
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-7 text-center text-white">
              <div className="scan-corners pointer-events-none absolute inset-10 opacity-40" />
              <QrGlyph />
              {cam === "idle" && secure && (
                <button type="button" onClick={() => setCam("starting")} className="m-btn m-btn-light">
                  Activer la caméra
                </button>
              )}
              {cam === "idle" && !secure && <p className="text-[16px] text-white/80">Ouvrez l&apos;appareil photo du téléphone et visez le QR code.</p>}
              {cam === "starting" && <span className="m-spinner size-8 border-white/30 border-t-white" aria-label="Démarrage" />}
              {cam === "denied" && <p className="text-[16px] text-white/80">Caméra refusée. Utilisez l&apos;appareil photo du téléphone.</p>}
              {cam === "unavailable" && <p className="text-[16px] text-white/80">Pas de caméra ici. Utilisez l&apos;appareil photo du téléphone.</p>}
            </div>
          )}
        </div>

        {note && <p className="m-rise mt-4 rounded-2xl bg-amber-soft px-4 py-3 text-[16px] text-amber">{note}</p>}

        <button type="button" onClick={openLatest} className="m-press mt-8 w-full rounded-full py-3 text-[16px] font-semibold text-cobalt">
          Démo : ouvrir le dernier ticket encaissé
        </button>
      </div>
    </div>
  );
}

function QrGlyph() {
  return (
    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-white/70" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <path d="M14 14h3v3h-3zM20 14v1M17 20h1M20 18v3h-2" />
    </svg>
  );
}
