# Portfolio — Antonino Lo Bianco

Portfolio personnel construit à partir du canvas Claude Design
[`design/Portfolio.dc.html`](design/Portfolio.dc.html).

**Stack :** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · CSS Modules

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
npx eslint .     # lint
```

## Le principe du site

Une seule page découpée en 5 panneaux plein écran (Home, Work, About, Stack,
Contact) qui défilent **horizontalement** avec aimantation. La molette
verticale est convertie en défilement horizontal, sauf quand le curseur est
sur le rail des projets ou sur un panneau qui déborde en hauteur. Les flèches
du clavier naviguent aussi.

Sous **900px** (constante `COMPACT_QUERY`), le site bascule automatiquement en
empilement vertical classique, la nav latérale devient une barre en bas
d'écran et les cartes projets passent en colonne.

## Structure

```
src/
├── app/
│   ├── globals.css       # tokens de design + animations globales
│   ├── layout.tsx        # polices (Archivo, Space Grotesk) + metadata SEO
│   └── page.tsx
├── components/
│   ├── Portfolio.tsx     # orchestrateur : scroll, molette, clavier, index actif
│   ├── SideNav.tsx       # nav verticale en verre + curseur glissant
│   ├── PanelDots.tsx     # pagination en bas d'écran
│   └── panels/           # un fichier .tsx + .module.css par panneau
├── hooks/
│   ├── useMediaQuery.ts
│   ├── useShellFx.ts     # halo au curseur, parallaxe, boutons magnétiques
│   └── useTilt.ts        # parallaxe 3D (disponible, non utilisé actuellement)
└── lib/
    └── content.ts        # TOUT le texte du site (projets, stack, à propos)
```

## Le panneau Work

Il fonctionne comme un carrousel de destinations : le **grand titre à gauche
affiche le projet actif**, et les cartes de droite se chevauchent (~35%) dans
un rail qui défile horizontalement. La carte la plus proche du centre du rail
devient l'active et pilote le titre, le texte, les tags et le compteur.
Cliquer une carte la ramène au centre.

Le chevauchement se règle d'une seule ligne, dans
`WorkPanel.module.css` :

```css
--card-overlap: calc(var(--card-w) * -0.35); /* 0.35 = 35% de recouvrement */
```

## Deux pièges à connaître

1. **Le panneau Work est en `overflow: clip` sur les deux axes**, avec un
   sélecteur doublé (`.pane.pane`) pour passer devant la classe partagée.
   En `hidden`, donner le focus à une carte fait défiler le panneau entier
   pour la révéler, et toute la mise en page se décale.
2. **Le canvas Claude Design pose des positions absolues en pixels** dès
   qu'on déplace un bloc dans l'éditeur visuel (`left: 3742px`, etc.). Ces
   coordonnées sont celles du canvas infini, pas de la page. Elles ne sont
   jamais reprises telles quelles ici : la mise en page est refaite en flux.

## Modifier le contenu

Tout le texte éditorial vit dans [`src/lib/content.ts`](src/lib/content.ts).
Ajouter un projet = ajouter un objet dans `PROJECTS`. Aucune autre modification
n'est nécessaire.

## À faire

- [ ] Héberger les 3 visuels de projets en local (`public/`) plutôt que sur
      `lbantonino.com`, pour ne pas dépendre de l'ancien site.
- [ ] Trancher le sort de `public/unused-08_21_55.png`, exporté avec le canvas
      mais référencé nulle part.
- [ ] Décider du sort du formulaire de contact : il ouvre aujourd'hui le client
      mail (`mailto:`), comme dans le design. Pour un vrai envoi, ajouter une
      route API et un service type Brevo ou Resend.
- [ ] Choisir le nom de domaine et déployer (Vercel).
