import type { NextConfig } from "next";
import os from "node:os";

// Le serveur de dev bloque ses scripts pour toute origine autre que localhost :
// sans ça, la caisse ouverte via l'IP du réseau local ne s'hydrate pas (boutons inactifs).
const lanIps = Object.values(os.networkInterfaces())
  .flatMap((list) => list ?? [])
  .filter((i) => i.family === "IPv4" && !i.internal)
  .map((i) => i.address);

const nextConfig: NextConfig = {
  allowedDevOrigins: lanIps,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
