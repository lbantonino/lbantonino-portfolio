import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Masque la pastille Next affichée en bas de l'écran en développement.
  // Les erreurs de compilation restent signalées dans le terminal.
  devIndicators: false,

  images: {
    remotePatterns: [{ protocol: "https", hostname: "lbantonino.com" }],
  },
};

export default nextConfig;
