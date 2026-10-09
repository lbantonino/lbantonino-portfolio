# Portfolio, ce qu'il reste à faire

Dernière mise à jour : 14 septembre 2026.

Ce fichier vit **en dehors du dépôt public** (`livrables/Site-Web/`, pas
dans `Portfolio/`). C'est volontaire : une liste de tâches et de failles
n'a rien à faire sur le GitHub que les recruteurs vont lire.

---

## 0. Où en est le site

Il est **en ligne et fonctionnel**. Rien n'est cassé, tu peux fermer VS
Code sans inquiétude.

| | |
| --- | --- |
| Adresse | https://www.lbantonino.com (l'apex redirige vers `www`) |
| Dépôt | `github.com/lbantonino/lbantonino-portfolio` (renommé, voir §1) |
| Hébergeur | Vercel, déploiement automatique à chaque push sur `main` |
| Dernier commit | `5d7543b` Textes anglais sans virgule avant « and » |
| Code local | `livrables/Site-Web/Portfolio/` |

**Ce qui marche, vérifié :** les 4 sections bilingues FR/EN, la démo
`/triage` avec Gemini en production, le formulaire de contact qui arrive
sur Outlook, la vignette de partage en anglais, zéro requête vers un
service tiers au chargement.

---

## 1. À faire tout de suite, 5 minutes

**Recoller le dépôt local à son nouveau nom.** Tu as renommé le repo sur
GitHub en `lbantonino-portfolio`. La redirection marche, mais autant être
propre. Une seule commande, dans `livrables/Site-Web/Portfolio/` :

```bash
git remote set-url origin https://github.com/lbantonino/lbantonino-portfolio.git
```

**Vider le cache d'aperçu de WhatsApp et LinkedIn.** L'ancienne vignette
française est encore en cache chez eux.
- LinkedIn : passe l'URL dans le *Post Inspector*
  (https://www.linkedin.com/post-inspector/), ça force la relecture.
- WhatsApp : pas d'outil officiel. Partage une fois `https://www.lbantonino.com/?v=2`
  pour voir la nouvelle vignette, puis l'URL normale reviendra d'elle-même
  après quelques jours.

**Envoyer un message de test depuis le formulaire en ligne** (pas en
local), pour confirmer qu'il arrive bien sur Outlook depuis le vrai
domaine. Tu l'as testé en local, pas encore en production.

**L'ancien projet Vercel.** Garde-le une semaine, le temps d'être sûr que
la bascule DNS est stable partout, puis supprime-le.

---

## 2. SEO

C'est le vrai trou du site aujourd'hui. J'ai vérifié : **il n'y a ni
`robots.txt`, ni `sitemap.xml`, ni données structurées.** Google peut
indexer le site, mais rien ne l'aide.

Par ordre d'impact réel :

**1. `robots.ts` et `sitemap.ts`.** Deux fichiers de dix lignes dans
`src/app/`. Next les génère tout seul. Sans sitemap, Google découvre
`/triage` par hasard ou pas du tout.

**2. Google Search Console.** Ajouter le domaine, soumettre le sitemap,
demander l'indexation. C'est gratuit et c'est ce qui déclenche vraiment
le passage du robot. Sans ça tu peux attendre des semaines.

**3. Données structurées `Person` en JSON-LD.** Un bloc `<script>` dans
le layout qui déclare : ton nom, ton métier, ta ville, tes profils
GitHub et LinkedIn. C'est ce qui permet à Google de comprendre que le
site parle d'une personne et de relier tes profils entre eux. Pour un
portfolio personnel, c'est le gain le plus direct.

**4. Les `alt` des images de projets.** Vérifié : dans
`WorkPanel.tsx:63` et `SectionHeader.tsx:25`, les `alt` sont vides. Pour
les avatars décoratifs c'est correct, il ne faut pas y toucher. Pour les
**captures de projets**, c'est une occasion manquée : « Site du BEHYBRID
Run Club, page d'accueil » vaut mieux que rien, pour Google Images comme
pour les lecteurs d'écran.

**5. La langue déclarée.** Le HTML envoyé par le serveur dit toujours
`lang="en"`, le JavaScript corrige ensuite si le visiteur est en
français (`useLanguage.ts:63`). Ça fonctionne pour le visiteur, mais le
robot voit la version anglaise. Acceptable pour l'instant. La vraie
solution serait des URL distinctes `/fr` et `/en`, c'est un gros
chantier, à ne lancer que si tu vises le référencement francophone.

**6. Ce qui est déjà bon, n'y retouche pas :** un seul `<h1>` par page,
la balise `<title>`, la `description`, le `canonical`, les métadonnées
Open Graph et `metadataBase`. Tout ça est en place et correct.

---

## 3. Refaire BeMovies

Décision déjà prise : **on repart de zéro plutôt que de rapiécer.** Le
projet actuel est du JS avec des `<script>`, hébergé sur GitHub Pages, et
il ne ressemble pas au reste de ton portfolio.

Ce qu'il faut garder de l'ancien : l'idée (explorer un catalogue de
films via l'API TMDB) et ta clé TMDB, qui est gratuite.

Ce qu'il faut changer :
- Next.js et TypeScript, comme le reste de ton travail
- la clé TMDB **côté serveur**, jamais dans le navigateur (dans
  l'ancienne version elle est visible dans le code source)
- recherche, fiche détaillée, et une vraie gestion du chargement et des
  erreurs, c'est ce qui distingue un exercice d'un produit

Un piège à connaître : **TMDB sert ses affiches depuis son propre CDN.**
Si tu veux garder la promesse « aucune requête tierce » du portfolio, ça
ne tiendra pas ici, et ce n'est pas grave. C'est une app, pas le
portfolio.

Où le mettre : un dossier `livrables/Apps/BeMovies/` et un dépôt à part.
Ne le mets pas dans le dépôt du portfolio.

---

## 4. Plus de démos d'automatisation

`/triage` a bien marché, le format est le bon : **une page, une
démonstration que le visiteur manipule lui-même, un repli qui fonctionne
même sans clé API.** Reproduis exactement cette recette.

Trois idées qui restent gratuites et qui montrent des compétences
différentes :

**Extraction de document.** Le visiteur colle un texte de facture ou de
devis, la page en ressort un JSON structuré (montant, date, émetteur,
lignes). Montre que tu sais transformer du désordre en données. Pas de
stockage, pas d'upload de fichier, donc rien à payer.

**Rédacteur de réponses par ton.** Un message entrant, trois réponses
générées avec trois registres différents (formel, direct, chaleureux).
Montre le contrôle du prompt, pas juste l'appel d'API.

**Qualification de prospect.** Une fiche entreprise en texte libre, la
page en sort un score, les signaux détectés et l'action recommandée.
C'est le plus parlant en entretien commercial.

**La règle à respecter sur toutes :** le moteur en logique pure dans un
fichier `lib/`, sans appel réseau, avec un repli déterministe par règles.
C'est ce qui fait que `/triage` ne tombe jamais en panne devant un
recruteur, et c'est ça qui impressionne, pas l'appel à l'IA.

---

## 5. Un SaaS

C'est le chantier le plus lourd des cinq, et le seul qui risque de te
coûter de l'argent. À ne lancer que quand les démos ci-dessus sont
faites, elles nourrissent le portfolio bien plus vite.

Ce qu'un SaaS ajoute par rapport à une démo, et qu'aucun de tes projets
actuels ne montre :
- des comptes utilisateurs et de l'authentification
- une base de données avec des données qui persistent
- du paiement, même en mode test
- du multi-locataire, c'est à dire les données de A invisibles pour B

**Sur la gratuité :** Supabase, Vercel et Stripe en mode test ont tous un
niveau gratuit qui suffit largement à une démonstration. Le piège n'est
pas là. Le piège, c'est le nom de domaine, et surtout un projet trop
ambitieux que tu ne finis jamais. **Un SaaS fini et minuscule vaut dix
fois un SaaS ambitieux à moitié construit.**

Une piste cohérente avec ton positionnement : un outil qui trie
automatiquement les demandes reçues par un formulaire de contact, avec
un tableau de bord. C'est `/triage` transformé en produit. Tu as déjà le
moteur.

---

## 6. Une app mobile

À garder pour plus tard, franchement. Elle n'ajoutera pas grand chose au
portfolio tant que le SEO n'est pas fait et que BeMovies traîne.

Si tu t'y mets : **React Native avec Expo**, parce que tu connais déjà
React et que tu peux tester sur ton iPhone sans Mac dédié ni compte
développeur. Publier sur l'App Store coûte 99 dollars par an, ce n'est
pas nécessaire pour le portfolio : une vidéo de démonstration et le code
sur GitHub suffisent.

---

## 7. Ce que tu dois savoir et que tu vas oublier

**Les deux clés d'API.** Elles sont dans `.env.local`, qui n'est **jamais**
versionné, et reportées dans les réglages Vercel. Si tu changes de
machine, tu dois les remettre à la main, elles ne sont nulle part
ailleurs.
- `NEXT_PUBLIC_WEB3FORMS_KEY` : publique par conception, elle ne permet
  que d'écrire dans ta boîte mail.
- `GEMINI_API_KEY` : un vrai secret, elle ne doit jamais atteindre le
  navigateur.

**Ne mets jamais une vraie valeur dans `.env.example`.** C'est déjà
arrivé, GitHub a bloqué le push. `.env.example` ne contient que des noms
de variables, vides.

**Le niveau gratuit de Gemini utilise tes données pour l'entraînement.**
C'est pour ça que `/triage` est une démonstration publique et que les
vrais messages du formulaire ne passent jamais par là. Ne mélange pas
les deux.

**Pour changer un texte du site : un seul fichier**, `src/lib/i18n.ts`.
Les deux langues y sont côte à côte, impossible d'en oublier une.

**Pour ajouter un projet :** un objet dans `src/lib/content.ts`, son
texte dans `i18n.ts`, et l'image dans `public/projects/`. Les champs
`cols` et `rows` décident de la place dans la mosaïque.

**Les accents dans les noms de fichiers.** Ça a cassé la mise en ligne
une fois : macOS accepte deux écritures différentes du même `é`, Linux
non. **Nomme tous tes fichiers sans accent**, c'est le plus simple.

**Le poids des images.** `public/projects/` pèse 8,2 Mo en sources.
Ce n'est pas ce que reçoit le visiteur : `next/image` convertit et
redimensionne à la volée, le site livré est léger. Tu peux donc ignorer
ce chiffre. Il gonfle juste le dépôt.

**Web3Forms n'accepte que les envois depuis le navigateur**, jamais
depuis un serveur, et il faut envoyer du `FormData`, pas du JSON. Si tu
touches au formulaire un jour et qu'il casse, c'est presque sûrement une
de ces deux raisons.

**Les modèles Gemini sont retirés régulièrement.** Le jour où `/triage`
bascule silencieusement sur son repli par règles, regarde le journal
Vercel : quand l'API renvoie une erreur 404, elle nomme le modèle
remplaçant dans son message. Il suffit de changer la constante `MODELE`
dans `src/app/api/triage/route.ts`.

**Le README du dépôt est la version courte** que tu as écrite toi-même
sur GitHub. La version longue et détaillée a été remplacée, c'était ton
choix.

---

## 8. Dans quel ordre

1. Le §1, cinq minutes, et c'est du concret en ligne
2. Le SEO, points 1 à 3. Une soirée, et c'est le meilleur rapport
   effort/résultat de toute cette liste
3. Une démo d'automatisation de plus. Tu as déjà la recette, c'est rapide
4. BeMovies refait
5. Le SaaS, quand le reste tient debout
6. L'app mobile, si l'envie est encore là

**Ne fais pas tout en même temps.** Le site est en ligne et il est bon.
Tout ce qui est au-dessus, c'est du bonus.
