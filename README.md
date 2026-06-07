# Mini-e-commerce-website-project

Drinks House est un mini site e-commerce de boissons naturelles.
L'idée c'est simple : les utilisateurs peuvent parcourir une sélection
de boissons, les ajouter à leur panier et passer commande.

Le site propose 12 produits répartis en 4 catégories :
  - Jus naturels (orange, pomme verte, mangue...)
  - Smoothies (fraise-banane, détox vert, fruits rouges...)
  - Thés (thé vert, thé à la menthe, camomille...)
  - Cafés (espresso, cappuccino, café glacé...)

 Les prix sont en DZD (dinars algériens).


  CE QUE LE SITE PEUT FAIRE:

  - Parcourir les produits et les filtrer par catégorie
  - Rechercher un produit par nom ou description
  - Trier les produits par prix ou par nom
  - Ajouter / retirer des articles du panier
  - Modifier les quantités directement dans le panier
  - Appliquer un code promo (voir les codes plus bas)
  - Créer un compte et se connecter
  - Passer une commande avec confirmation


  PAGES DU SITE:

  index.html              → Page d'accueil avec les produits en vedette
  content/products.html   → Catalogue complet des boissons
  content/cart.html       → Panier et validation de commande
  content/login.html      → Connexion
  content/register.html   → Inscription
  content/about.html      → À propos
  content/contact.html    → Formulaire de contact




  STRUCTURE DES FICHIERS:

  /
  ├── index.html              → Page d'accueil
  ├── package.json            → Config Node / scripts npm
  │
  ├── content/                → Pages secondaires
  │   ├── products.html
  │   ├── cart.html
  │   ├── login.html
  │   ├── register.html
  │   ├── about.html
  │   └── contact.html
  │
  ├── javascript/             → Toute la logique JS
  │   ├── products.js         → Données produits + fonctions de filtrage
  │   ├── cart.js             → Gestion du panier
  │   ├── auth.js             → Inscription, connexion, validation
  │   ├── filter.js           → Filtres et tri des produits
  │   ├── contact.js          → Formulaire de contact
  │   └── main.js             → Navigation + session utilisateur
  │
  ├── style/                  → Feuilles de style CSS
  │   ├── main.css            → Styles globaux et navbar
  │   ├── products.css        → Page produits
  │   ├── cart.css            → Page panier
  │   ├── auth.css            → Pages login / register
  │   ├── contact.css         → Page contact
  │   ├── about.css           → Page à propos
  │   └── responsive.css      → Adaptations mobile
  │
  ├── images/                 → Photos des produits et assets visuels
  └── public/                 → Icônes et images génériques



  TECHNOLOGIES UTILISÉES:

  - HTML5 / CSS3 
  - JavaScript
  - LocalStorage pour la persistance des données






