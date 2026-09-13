/**
 * Données non traduisibles : liens, visuels, et tout ce qui ne change pas
 * d'une langue à l'autre. Les textes vivent dans `i18n.ts`.
 */

export const SECTION_COUNT = 4;

export const CONTACT_EMAIL = 'antonino.lobianco@outlook.com';

/**
 * À COMPLÉTER : numéro affiché sur la page Contact, au format
 * international, par exemple "+32 470 00 00 00". Tant qu'il est vide,
 * la ligne n'apparaît pas.
 */
export const CONTACT_PHONE: string = '+32 487 30 18 90';

export const SOCIALS = {
  github: 'https://github.com/lbantonino',
  linkedin: 'https://www.linkedin.com/in/antoninolobianco/',
} as const;

/**
 * Portrait affiché sous le nom de la section, un par section, dans
 * l'ordre du défilement : accueil, projets, à propos, contact.
 *
 * Ce sont des versions normalisées des `3D-*.png` d'origine, qui sont
 * restés dans `public/`. Les originaux n'ont pas le même cadrage entre
 * eux : trois ont 20 % de vide à gauche, le quatrième aucun. Les têtes
 * auraient donc changé de taille et de position d'une page à l'autre.
 * Ces copies sont recadrées sur la silhouette et remises au même format.
 */
export const SECTION_AVATARS = [
  '/avatar/home.png',
  '/avatar/projects.png',
  '/avatar/aboutme.png',
  '/avatar/contact.png',
] as const;

/** Familles de projets : sert aux libellés de catégorie. */
export type Category = 'web' | 'app' | 'automation';

export type ProjectMeta = {
  title: string;
  /** Lien du projet. Vide : la carte n'est pas cliquable. */
  href: string;
  /** Visuel de la carte. Vide : la carte affiche un cadre nu. */
  img: string;
  stack: string[];
  category: Category;
  /** Année de livraison. Laissée vide, elle n'est pas affichée. */
  year: string;
  /**
   * Encombrement dans la mosaïque, en cases. Le placement est automatique
   * et compact : faire varier ces deux nombres suffit à casser la
   * régularité de la grille.
   */
  cols: 1 | 2 | 3;
  rows: 1 | 2 | 3;
};

/**
 * Ordre de référence des projets : les textes traduits suivent le même.
 *
 * À COMPLÉTER :
 *  - `img` est vide partout, les cartes attendent leurs captures.
 *  - `year` est vide : je n'ai pas les dates réelles.
 *  - les `stack` des deux sites clients ne contiennent que ce qui est
 *    observable depuis le site publié.
 */
export const PROJECT_META: ProjectMeta[] = [
  {
    title: 'BEHYBRID Run Club',
    href: 'https://behybridrunclub.com/',
    img: '/projects/behybrid.png',
    stack: ['Next.js', 'TypeScript', 'Supabase'],
    category: 'web',
    year: '',
    cols: 3,
    rows: 2,
  },
  {
    title: 'Group Cleaning & Services',
    href: 'https://www.groupservices.be/',
    img: '/projects/groupservices.png',
    stack: ['WordPress'],
    category: 'web',
    year: '',
    cols: 3,
    rows: 2,
  },
  {
    title: 'Baert Antiquités',
    href: 'https://www.baert-antiquites.be/',
    img: '/projects/baertantiquité.png',
    stack: ['WordPress'],
    category: 'web',
    year: '',
    cols: 2,
    rows: 2,
  },
  {
    title: 'BeMovies',
    href: 'https://lbantonino.github.io/BeMovies/',
    img: '/projects/bemovies.png',
    stack: ['TMDB', 'JS', 'SwiperJS'],
    category: 'app',
    year: '',
    cols: 2,
    rows: 2,
  },
  {
    // PROJET FICTIF, à remplacer par le vrai projet d'automatisation.
    // Ne pas mettre ce site en ligne avec cette carte telle quelle.
    title: 'Inbox Triage Pipeline',
    href: '',
    img: '/projects/automate.png',
    stack: ['n8n', 'OpenAI', 'Gmail', 'Notion'],
    category: 'automation',
    year: '',
    cols: 2,
    rows: 2,
  },
];
