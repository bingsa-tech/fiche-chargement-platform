Contrat API — Admin Web
1. Objectif

Ce document décrit le contrat entre :

Vue Admin
    ↕
NestJS Backend

L'application Vue ne communique jamais directement avec PostgreSQL.

2. URL de développement

Le backend NestJS écoute actuellement sur :

http://localhost:8085

La documentation Swagger est disponible sur :

http://localhost:8085/api/docs

La valeur doit être configurée via :

VITE_API_URL=http://localhost:8085
3. Authentification
Login
POST /api/auth/login

Le frontend transmet les informations d'identification conformément au DTO du backend.

Requêtes protégées

Les requêtes authentifiées utilisent :

Authorization: Bearer <accessToken>
4. Gares

Exemples d'opérations :

GET /api/gares
GET /api/gares/:id
POST /api/gares
PATCH /api/gares/:id
DELETE /api/gares/:id

Les permissions doivent être respectées selon le rôle.

Exemple métier actuel :

ADMIN → peut créer une gare

Le backend doit également vérifier cette permission.

5. Véhicules
GET /api/vehicules
GET /api/vehicules/:id
POST /api/vehicules
PATCH /api/vehicules/:id
DELETE /api/vehicules/:id

Les documents associés au véhicule doivent être traités conformément au contrat métier défini par le backend.

6. Chauffeurs
GET /api/chauffeurs
GET /api/chauffeurs/:id
POST /api/chauffeurs
PATCH /api/chauffeurs/:id
DELETE /api/chauffeurs/:id

Les documents associés au chauffeur doivent respecter le modèle métier du backend.

7. Documents

Les documents sont liés notamment aux :

chauffeurs ;
véhicules.

Exemples :

GET /api/documents/...
POST /api/documents/...
PATCH /api/documents/...
DELETE /api/documents/...

Les routes exactes doivent être vérifiées dans Swagger avant implémentation.

8. Fiches

Les opérations concernant les fiches suivent le même principe :

Vue
 ↓
API service
 ↓
NestJS
 ↓
TypeORM
 ↓
PostgreSQL

Les endpoints définitifs doivent être documentés à partir de Swagger.

9. Gestion des erreurs

Le frontend doit traiter au minimum :

400 → requête invalide
401 → non authentifié
403 → accès interdit
404 → ressource inexistante
409 → conflit
500 → erreur serveur

Les messages présentés à l'utilisateur doivent rester compréhensibles.

10. Règle importante

Ne pas inventer un endpoint dans Vue.

Avant d'utiliser une nouvelle route :

vérifier le controller NestJS ;
vérifier Swagger ;
vérifier le DTO ;
vérifier le format de réponse ;
documenter le contrat ici.
11. Évolution du contrat

Toute modification importante d'une API doit être communiquée avant son intégration dans Admin.

Les changements doivent préserver la compatibilité avec les clients existants lorsque cela est possible.