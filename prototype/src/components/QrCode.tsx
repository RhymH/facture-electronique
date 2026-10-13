"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function QrCode({ value, size = 160, className = "" }: { value: string; size?: number; className?: string }) {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    let alive = true;
    QRCode.toString(value, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#1c2433", light: "#0000" } })
      .then((s) => alive && setSvg(s))
      .catch(() => alive && setSvg(""));
    return () => {
      alive = false;
    };
  }, [value]);
  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      aria-label="QR code vers la page de facturation"
      role="img"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
