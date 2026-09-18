Collaboration — Admin Web
1. Périmètre du collaborateur

Le collaborateur travaille principalement sur :

apps/admin/

Le périmètre principal est l'application Web Vue 3.

2. Périmètre hors responsabilité

Sauf accord préalable, ne pas modifier directement :

apps/mobile/
apps/backend/

Les modifications backend nécessaires à Admin doivent être discutées avant intégration.

3. Dépôt Git

Le projet est un monorepo :

fiche-chargement-platform

Les trois applications sont :

apps/mobile
apps/backend
apps/admin
4. Branches

Le travail doit être effectué sur une branche dédiée.

Exemple :

feature/admin-dashboard
feature/admin-gares
feature/admin-vehicules
feature/admin-chauffeurs
feature/admin-fiches

Éviter de travailler directement sur main.

5. Workflow recommandé
develop
   ↓
création branche feature
   ↓
développement
   ↓
tests
   ↓
commit
   ↓
push
   ↓
Pull Request
   ↓
review
   ↓
merge
6. Commits

Les messages de commit doivent être explicites.

Exemples :

feat(admin): add dashboard layout
feat(admin): add gare list
feat(admin): add vehicle form
fix(admin): correct role navigation
refactor(admin): simplify auth store
test(admin): add login tests
7. Avant une Pull Request

Vérifier :

npm run build

et, si disponibles :

npm run test

et :

npm run lint

Les commandes exactes dépendent du package.json actuel.

8. Règle d'or

Ne pas modifier l'architecture d'authentification ou du Role Hub sans discussion préalable.

Les éléments suivants constituent le socle partagé :

Axios
Auth Store
JWT
Role Hub
Router Guards
API client
9. Données et secrets

Ne jamais commit :

.env
.env.local
tokens
passwords
JWT secrets
database credentials

Utiliser :

.env.example

pour documenter les variables nécessaires.

10. Base de données

Le collaborateur Admin n'a pas besoin d'accéder directement à PostgreSQL pour développer l'interface.

Le flux est :

Vue Admin
    ↓
NestJS API
    ↓
PostgreSQL

Pour les développements indépendants, des données mockées peuvent être utilisées lorsque l'API n'est pas disponible.

11. Modification du backend

Si une fonctionnalité Admin nécessite une nouvelle API :

identifier le besoin ;
documenter le besoin ;
discuter avec le responsable backend ;
définir le contrat API ;
implémenter ;
tester ;
intégrer dans Admin.
12. Objectif de la collaboration

Le collaborateur doit pouvoir développer rapidement les fonctionnalités Admin sans modifier accidentellement :

l'authentification ;
les rôles ;
le backend ;
l'application Flutter ;
la base de données.

L'objectif est de conserver un monorepo cohérent et stable.