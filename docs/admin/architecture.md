# Architecture — Admin Web

## 1. Objectif

L'application `admin` est l'interface Web de gestion de la plateforme **Fiche Chargement**.

Elle permet aux utilisateurs autorisés de consulter et gérer les données métier exposées par le backend NestJS.

L'application est développée avec :

* Vue 3
* TypeScript
* Vite
* Pinia
* Vue Router
* Axios

L'application Admin ne communique pas directement avec PostgreSQL.

## 2. Architecture générale

```text
┌──────────────────────────────┐
│          Admin Web           │
│        Vue 3 + TypeScript    │
└──────────────┬───────────────┘
               │
               │ HTTP / REST
               │ JWT
               ▼
┌──────────────────────────────┐
│       Backend NestJS         │
│                              │
│ Controllers                  │
│ Services                     │
│ Guards / JWT                 │
│ TypeORM                      │
└──────────────┬───────────────┘
               │
               │ PostgreSQL
               ▼
┌──────────────────────────────┐
│       PostgreSQL             │
│      db_fiche_chargement     │
└──────────────────────────────┘
```

## 3. Principe fondamental

L'application Vue ne doit jamais accéder directement à PostgreSQL.

Toutes les opérations de données passent par l'API NestJS.

```text
Vue → NestJS → PostgreSQL
```

et jamais :

```text
Vue → PostgreSQL
```

## 4. Structure du projet

```text
apps/admin/
├── public/
├── src/
│   ├── api/
│   ├── auth/
│   ├── components/
│   ├── layouts/
│   ├── router/
│   ├── stores/
│   ├── types/
│   ├── views/
│   ├── App.vue
│   └── main.ts
├── .env.example
├── package.json
├── tsconfig.json
└── vite.config.ts
```

La structure peut évoluer avec l'avancement du projet, mais les responsabilités doivent rester séparées.

## 5. Responsabilités principales

### `api/`

Contient la configuration Axios et les appels vers l'API NestJS.

### `auth/`

Contient la logique d'authentification côté Admin :

* connexion ;
* déconnexion ;
* session ;
* utilisateur courant ;
* token JWT ;
* gestion du rôle.

### `stores/`

Contient les stores Pinia.

Exemple :

```text
authStore
gareStore
vehiculeStore
chauffeurStore
ficheStore
```

### `router/`

Contient les routes Vue et les guards de navigation.

### `layouts/`

Contient les layouts généraux de l'application.

Exemple :

```text
AdminLayout
AgentLayout
ControleurLayout
AutoriteLayout
```

### `views/`

Contient les pages visibles par l'utilisateur.

Exemple :

```text
LoginView
AdminDashboard
GaresView
VehiculesView
ChauffeursView
FichesView
```

## 6. Flux d'une requête

Exemple : affichage des gares.

```text
GaresView
   ↓
gareStore
   ↓
gare.api.ts
   ↓
Axios
   ↓
GET /api/gares
   ↓
NestJS
   ↓
TypeORM
   ↓
PostgreSQL
```

La réponse revient ensuite dans le sens inverse.

## 7. Sécurité

Le frontend ne constitue pas la couche de sécurité principale.

Les permissions doivent également être contrôlées par NestJS.

Le frontend utilise les rôles pour :

* afficher ou masquer les fonctionnalités ;
* protéger les routes ;
* orienter l'utilisateur vers son espace.

NestJS reste responsable de l'autorisation réelle.

## 8. Environnement

Les paramètres spécifiques à l'environnement doivent être configurés avec les variables Vite.

Exemple :

```env
VITE_API_URL=http://localhost:8085
```

Les secrets ne doivent jamais être commités dans Git.

Le fichier `.env.example` peut être versionné.

## 9. Principe de développement

Toute nouvelle fonctionnalité Admin doit respecter le flux :

   text
Vue Component
    ↓
Store / composable
    ↓
API service
    ↓
NestJS



