import type { NextConfig } from "next";

const enDeveloppement = process.env.NODE_ENV === "development";

/**
 * Politique de contenu : la page ne charge que les fichiers du site.
 * Seule exception, le formulaire de contact, envoyé depuis le navigateur
 * à Web3Forms. Aucun script, aucune police ni aucune image tierce.
 *
 * `'unsafe-inline'` reste nécessaire : Next insère ses scripts de
 * démarrage dans la page, et React pose des styles en ligne (`style={…}`).
 * Les bloquer demanderait un nonce par requête, donc des pages toutes
 * rendues à la demande : un coût sans rapport avec un portfolio sans
 * compte ni donnée sensible.
 */
const POLITIQUE_DE_CONTENU = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://api.web3forms.com",
  "form-action 'self'",
  // Le site ne s'affiche dans un cadre que sur lui-même : pas de
  // détournement de clic depuis une autre page.
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

/** En-têtes valables partout, développement compris. */
const ENTETES_COMMUNS = [
  // Le navigateur ne devine pas le type d'un fichier : un texte reste un texte.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Un site visité depuis le portfolio ne reçoit que le domaine, pas la page.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Le site n'utilise ni caméra, ni micro, ni position, ni paiement.
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

/**
 * En-têtes réservés à la production. En développement, React a besoin
 * d'`eval` pour ses outils, et l'extension « Mobile View » affiche le site
 * dans un cadre : la politique de contenu les bloquerait.
 */
const ENTETES_PRODUCTION = [
  { key: "Content-Security-Policy", value: POLITIQUE_DE_CONTENU },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // HTTPS uniquement pendant deux ans, sur ce domaine seulement : les
  // sous-domaines éventuels gardent leur propre réglage.
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
];

const nextConfig: NextConfig = {
  // Masque la pastille Next affichée en bas de l'écran en développement.
  // Les erreurs de compilation restent signalées dans le terminal.
  devIndicators: false,

  // Ne pas annoncer la technologie du serveur (« X-Powered-By: Next.js »).
  poweredByHeader: false,

  images: {
    remotePatterns: [{ protocol: "https", hostname: "lbantonino.com" }],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: enDeveloppement
          ? ENTETES_COMMUNS
          : [...ENTETES_COMMUNS, ...ENTETES_PRODUCTION],
      },
    ];
  },
};

export default nextConfig;
