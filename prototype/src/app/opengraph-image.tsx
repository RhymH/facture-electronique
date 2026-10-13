import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const alt = `${SITE_NAME} : ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Image de partage par défaut : le nom, la promesse, et un ticket stylisé avec son QR.
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#ffffff",
          color: "#141b2d",
          fontFamily: "sans-serif",
          padding: 72,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 720 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40, fontWeight: 700 }}>
            <div style={{ width: 44, height: 56, background: "#141b2d", borderRadius: 8, display: "flex" }} />
            {SITE_NAME}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2 }}>
              La facture électronique B2B, en scannant le ticket.
            </div>
            <div style={{ fontSize: 28, color: "#4a5068", lineHeight: 1.3 }}>
              Un module en marque blanche pour les éditeurs de logiciels de caisse.
            </div>
          </div>
          <div style={{ display: "flex", background: "#ffe34d", padding: "10px 18px", borderRadius: 8, fontSize: 24, fontWeight: 700, width: 420 }}>
            Prêt avant septembre 2027
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 90,
            top: 48,
            width: 300,
            height: 620,
            background: "#fffdf8",
            boxShadow: "0 30px 60px rgba(20,27,45,0.25)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "36px 28px",
            fontSize: 18,
            color: "#262b33",
            transform: "rotate(3deg)",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 20 }}>QUINCAILLERIE MARTIN</div>
          <div style={{ display: "flex", flexDirection: "column", width: "100%", marginTop: 28, gap: 10 }}>
            {["Vis inox 4x40      19,80", "Cheville nylon      6,50", "Mèche béton        14,90"].map((l) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{l.split(/\s{2,}/)[0]}</span>
                <span>{l.split(/\s{2,}/)[1]}</span>
              </div>
            ))}
            <div style={{ borderTop: "2px dashed #9aa0a6", marginTop: 8 }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 22 }}>
              <span>TOTAL TTC</span>
              <span>41,20</span>
            </div>
          </div>
          <div style={{ marginTop: 34, fontWeight: 700 }}>BESOIN D&apos;UNE FACTURE ?</div>
          <div
            style={{
              marginTop: 16,
              width: 150,
              height: 150,
              display: "flex",
              flexWrap: "wrap",
              background: "#141b2d",
              padding: 10,
            }}
          >
            {Array.from({ length: 49 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 130 / 7,
                  height: 130 / 7,
                  background: (i * 7919) % 3 === 0 || i < 8 || i % 7 === 0 ? "#141b2d" : "#fffdf8",
                }}
              />
            ))}
          </div>
          <div style={{ marginTop: 22, background: "#ffe34d", padding: "6px 12px", fontWeight: 700, transform: "rotate(-3deg)" }}>
            VENTE B2B FACTURÉE
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
