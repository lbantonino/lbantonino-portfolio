import type { Metadata, Viewport } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

/**
 * Domaine de référence des métadonnées.
 *
 * Sans lui, Next construit l'adresse de la vignette sur le domaine
 * technique `.vercel.app`. Ça fonctionne, mais l'aperçu pointe alors vers
 * un autre domaine que la page, ce que certaines messageries digèrent
 * mal, et le lien de l'image révèle l'hébergeur plutôt que le site.
 */
const SITE = "https://www.lbantonino.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Digital Specialist Solutions | Antonino",
  description:
    "Full-stack developer specialised in front-end, based in Brussels. Web development, AI automation and brand systems.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Digital Specialist Solutions | Antonino",
    description:
      "Web development, AI automation and brand systems, from Brussels.",
    type: "website",
    locale: "en_US",
    // WhatsApp s'appuie sur cette adresse pour composer son aperçu.
    url: SITE,
    siteName: "Antonino Lo Bianco",
  },
};

export const viewport: Viewport = {
  themeColor: "#060709",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
