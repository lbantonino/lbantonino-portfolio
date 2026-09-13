/**
 * Tout le texte du site, dans les deux langues.
 * Pour corriger une phrase, c'est le seul fichier à ouvrir : les deux
 * versions sont côte à côte, donc rien ne peut être oublié.
 */

export const LANGS = ["en", "fr"] as const;
export type Lang = (typeof LANGS)[number];

export type Pillar = {
  label: string;
  title: string;
  body: string;
  points: string[];
};

export type Copy = {
  /** Valeur de l'attribut `lang` de la page. */
  htmlLang: string;
  /** Libellés des quatre sections, dans l'ordre du défilement. */
  sections: string[];
  status: string;
  hero: {
    /** Les trois lignes frappées par la machine à écrire. */
    titleLines: string[];
    lede: string;
    seeWork: string;
    startProject: string;
  };
  pillars: Pillar[];
  work: {
    explore: string;
    viewProject: string;
    /** Un couple par projet, dans l'ordre de `PROJECT_META`. */
    projects: { badges: string[]; body: string }[];
  };
  about: {
    eyebrow: string;
    titleLines: string[];
    paragraphs: string[];
    /** Termes métier qui s'allument en cascade dans le texte. */
    keywords: string[];
  };
  stack: {
    eyebrow: string;
    title: string;
    groups: { label: string; items: string[] }[];
    marquee: string;
  };
  contact: {
    eyebrow: string;
    titleLines: string[];
    /** Une entrée par ligne : la dernière phrase tient sa propre ligne. */
    lede: string[];
    emailRow: string;
    phoneRow: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submit: string;
    noteIdle: string;
    noteSending: string;
    noteSent: string;
    /** `{email}` est remplacé par l'adresse de contact. */
    noteError: string;
    /** Objet du courriel, `{name}` est remplacé par le nom saisi. */
    mailSubject: string;
  };
};

const EN: Copy = {
  htmlLang: "en",
  sections: ["Home", "Projects", "About", "Contact"],
  status: "Open for projects",
  hero: {
    titleLines: ["Digital", "Specialist", "Solutions"],
    lede: "I build the site, I teach the robots to handle the boring bits, and I make the whole thing look like someone actually cared. Three jobs, one guy, zero group chats.",
    seeWork: "See the work →",
    startProject: "Start a project",
  },
  pillars: [
    {
      label: "Build",
      title: "Software Development",
      body: "Products that feel fast to use and hold up once they are live.",
      points: [
        "From the first sketch to the deployed product",
        "A clean interface in front, solid logic behind",
        "Built to be maintained, not just delivered",
      ],
    },
    {
      label: "Automate",
      title: "AI & Automation",
      body: "Assistants and pipelines that delete busywork.",
      points: [
        "Assistants plugged into the tools you already use",
        "Scripts that swallow the repetitive half of a day",
        "Workflows wired end to end, then left alone",
      ],
    },
    {
      label: "Design",
      title: "Brand & Visual Communication",
      body: "One visual system, sharp everywhere.",
      points: [
        "Logo, palette and type as a single kit",
        "Social, print and web speaking the same language",
        "Design systems that survive contact with code",
      ],
    },
  ],
  work: {
    explore: "Explore",
    viewProject: "View project",
    projects: [
      {
        badges: ["Development", "Webdesign"],
        body: "Community platform for the BEHYBRID run club in Brussels: calendar, newsletter and member space.",
      },
      {
        badges: ["Development"],
        body: "Site for a Belgian cleaning and facilities company: services, sectors served and quote requests.",
      },
      {
        badges: ["Development"],
        body: "Site for an antiques dealer: appraisal and purchase of art objects, with free online valuation.",
      },
      {
        badges: ["Development"],
        body: "Streaming interface on the TMDB API: catalogue, live search, categories and recommendations.",
      },
      {
        badges: ["Automate"],
        body: "Sorts incoming requests, drafts the reply and files it, without anyone opening the inbox.",
      },
    ],
  },
  about: {
    eyebrow: "",
    titleLines: ["Curious mind.", "Sharp eye."],
    keywords: [
      "web development",
      "graphic design",
      "digital marketing",
      "artificial intelligence",
      "automated workflows",
      "software development",
    ],
    paragraphs: [
      "Hi, I am Antonino and I'm a Digital Specialist Solutions with a multidisciplinary background in web development, graphic design, digital marketing and artificial intelligence.",
      "I enjoy turning ideas and business needs into practical, modern digital solutions. My experience across design, development and marketing allows me to approach projects from both a technical and creative perspective.",
      "Working at VOO, Crispin Medical, Opengraphy and Protection Unit sharpened my skills as a web and software developer, in automation, in design and as a sales representative.",
      "Today, I mainly work with modern web technologies, AI-assisted tools to build websites, applications, also automated workflows that are useful, efficient and easy to use.",
      "My goal is simple: create digital solutions that save time, reduce repetitive tasks, improve efficiency and make everyday work easier.",
      "I'm constantly learning and strengthening my skills, with a growing focus on software development, automation and artificial intelligence.",
    ],
  },
  stack: {
    eyebrow: "03 — Toolbox",
    title: "The stack I reach for",
    groups: [
      {
        label: "Build",
        items: [
          "TypeScript",
          "React",
          "Next.js",
          "Node.js",
          "EJS",
          "Tailwind CSS",
          "MongoDB",
          "Supabase",
          "MySQL",
          "Docker",
          "Postman",
        ],
      },
      {
        label: "Automate",
        items: ["n8n", "Claude", "ChatGPT"],
      },
      {
        label: "Design",
        items: [
          "Figma",
          "Adobe Suite",
          "Design systems",
          "Motion",
        ],
      },
    ],
    marquee:
      "Software Development ✦ AI & Automation ✦ Brand & Visual Communication ✦",
  },
  contact: {
    eyebrow: "03 — Contact",
    titleLines: ["Got a project?", "Let's build it."],
    lede: [
      "A site, an automation, or a brand that needs a real system behind it. Tell me what's on your desk —",
      "I answer fast.",
    ],
    emailRow: "Email",
    phoneRow: "Phone",
    nameLabel: "Your name",
    namePlaceholder: "Jane Doe",
    emailLabel: "Email",
    emailPlaceholder: "jane@company.com",
    messageLabel: "What are we building?",
    messagePlaceholder: "A site, an automation, a rebrand…",
    submit: "Send me your project ↗",
    noteIdle: "Straight to my inbox. No newsletter, promise.",
    noteSending: "Sending…",
    noteSent: "Got it — I'll get back to you shortly.",
    noteError: "Something went wrong. Write to me directly at {email}.",
    mailSubject: "New project — {name}",
  },
};

const FR: Copy = {
  htmlLang: "fr",
  sections: ["Accueil", "Projets", "À propos", "Contact"],
  status: "Ouvert aux projets",
  hero: {
    titleLines: ["Digital", "Specialist", "Solutions"],
    lede: "Je construis le site, j'apprends aux robots à gérer les tâches ingrates, et je fais en sorte que l'ensemble ait l'air soigné. Trois métiers, une seule personne, zéro réunion inutile.",
    seeWork: "Voir les projets →",
    startProject: "Démarrer un projet",
  },
  pillars: [
    {
      label: "Développer",
      title: "Développement logiciel",
      body: "Des produits agréables à utiliser, et solides une fois en ligne.",
      points: [
        "Du premier croquis au produit déployé",
        "Une interface nette devant, une logique solide derrière",
        "Pensé pour être maintenu, pas seulement livré",
      ],
    },
    {
      label: "Automatiser",
      title: "IA & Automatisation",
      body: "Des assistants et des chaînes qui suppriment les tâches répétitives.",
      points: [
        "Des assistants branchés sur les outils que vous utilisez déjà",
        "Des scripts qui avalent la moitié répétitive d'une journée",
        "Des flux connectés de bout en bout, puis qu'on oublie",
      ],
    },
    {
      label: "Design",
      title: "Marque & communication visuelle",
      body: "Un seul système visuel, net partout.",
      points: [
        "Logo, palette et typographie en un seul kit",
        "Réseaux, print et web qui parlent la même langue",
        "Des design systems qui survivent au passage au code",
      ],
    },
  ],
  work: {
    explore: "Explorer",
    viewProject: "Voir le projet",
    projects: [
      {
        badges: ["Development", "Webdesign"],
        body: "Plateforme du run club BEHYBRID à Bruxelles : calendrier, newsletter et espace membre.",
      },
      {
        badges: ["Development"],
        body: "Site d'une société belge de nettoyage et de services : prestations, secteurs et devis.",
      },
      {
        badges: ["Development"],
        body: "Site d'un antiquaire : expertise et achat d'objets d'art, avec estimation gratuite en ligne.",
      },
      {
        badges: ["Development"],
        body: "Interface de streaming sur l'API TMDB : catalogue, recherche en direct, catégories et recommandations.",
      },
      {
        badges: ["Automate"],
        body: "Trie les demandes entrantes, rédige la réponse et la classe, sans que personne n'ouvre la boîte mail.",
      },
    ],
  },
  about: {
    eyebrow: "",
    titleLines: ["Un esprit curieux.", "Un œil vif."],
    keywords: [
      "développement web",
      "design graphique",
      "marketing digital",
      "intelligence artificielle",
      "automatisations",
      "développement logiciel",
    ],
    paragraphs: [
      "Bonjour, je suis Antonino, spécialiste des solutions numériques, avec un parcours pluridisciplinaire en développement web, design graphique, marketing digital et intelligence artificielle.",
      "J'aime transformer des idées et des besoins métier en solutions numériques concrètes et actuelles. Mon expérience entre design, développement et marketing me permet d'aborder un projet sous l'angle technique comme sous l'angle créatif.",
      "Avoir travaillé chez VOO, Crispin Medical, Opengraphy et Protection Unit m'a permis d'affiner mes compétences de développeur web et logiciel, en automatisation, en design et comme agent commercial.",
      "Aujourd'hui, je travaille surtout avec les technologies web modernes et des outils assistés par IA pour construire des sites, des applications et des automatisations utiles, efficaces et simples à utiliser.",
      "Mon objectif est simple : créer des solutions qui font gagner du temps, réduisent les tâches répétitives, améliorent l'efficacité et rendent le quotidien de travail plus léger.",
      "Je continue à apprendre et à renforcer mes compétences, avec un intérêt croissant pour le développement logiciel, l'automatisation et l'intelligence artificielle.",
    ],
  },
  stack: {
    eyebrow: "03 — Boîte à outils",
    title: "Les outils que j'utilise",
    groups: [
      {
        label: "Développer",
        items: [
          "TypeScript",
          "React",
          "Next.js",
          "Node.js",
          "EJS",
          "Tailwind CSS",
          "MongoDB",
          "Supabase",
          "MySQL",
          "Docker",
          "Postman",
        ],
      },
      {
        label: "Automatiser",
        items: ["n8n", "Claude", "ChatGPT"],
      },
      {
        label: "Design",
        items: [
          "Figma",
          "Adobe Suite",
          "Design systems",
          "Motion",
        ],
      },
    ],
    marquee:
      "Développement logiciel ✦ IA & automatisation ✦ Marque & communication visuelle ✦",
  },
  contact: {
    eyebrow: "03 — Contact",
    titleLines: ["Un projet ?", "Construisons-le."],
    lede: [
      "Un site, une automatisation, ou une marque qui a besoin d'un vrai système derrière. Dites-moi ce qui est sur votre bureau, je réponds vite.",
    ],
    emailRow: "E-mail",
    phoneRow: "Téléphone",
    nameLabel: "Votre nom",
    namePlaceholder: "Jean Dupont",
    emailLabel: "E-mail",
    emailPlaceholder: "jean@entreprise.com",
    messageLabel: "On construit quoi ?",
    messagePlaceholder: "Un site, une automatisation, une refonte…",
    submit: "Envoyez-moi votre projet ↗",
    noteIdle: "Directement dans ma boîte mail. Pas de newsletter, promis.",
    noteSending: "Envoi en cours…",
    noteSent: "Bien reçu, je reviens vers vous rapidement.",
    noteError: "L'envoi a échoué. Écrivez-moi directement à {email}.",
    mailSubject: "Nouveau projet — {name}",
  },
};

export const COPY: Record<Lang, Copy> = { en: EN, fr: FR };
