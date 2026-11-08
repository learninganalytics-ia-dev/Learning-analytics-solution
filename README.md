# Learning Analytics Solution

Apprenez à construire votre agent analytics ou utilisez les outils disponibles avec vos données et votre domaine.

Plateforme : https://lasolution-chi.vercel.app/

## Version 0.2

- Six modules de formation enrichis, exercices, corrigés et projet final.
- Compte apprenant Supabase, progression, projets personnels et historique d'analyses.
- Agent local avec statistiques, ACP, clustering et preuves de calcul.
- Starter autonome téléchargeable et exemples synthétiques énergie/formation.
- Mode génératif préparé côté serveur, désactivé en attente de modèle, budget et comptes pilotes autorisés.

## Développer

Node.js 24. Dépendances exactes et package-lock.json versionnés.

```sh
npm ci
npm test
npm run build
npm run dev
```

Sortie statique : dist/. Route serveur : api/agent.js. Aucun service_role ou secret de modèle dans les sources. Les valeurs de web/config.mjs sont les paramètres publics Supabase, protégés par RLS côté base.

## Documentation

- [Fonctions, protections et limites de la version 0.2](docs/platform-v2.md)
- [Périmètre produit](docs/product-scope.md)
- [Formation et outils prêts à utiliser](docs/offer-model.md)
- [Starter de construction](examples/agent-starter/README.md)
- [Deux domaines de démonstration](examples/domains/README.md)

Le dépôt est connecté au projet Vercel lasolution. Les changements autorisés passent par GitHub. Les configurations non secrètes, tests, migration, compétences de l'équipe et rapports sont versionnés ; les secrets et données utilisateurs ne le sont pas.
