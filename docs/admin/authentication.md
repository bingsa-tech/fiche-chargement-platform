Authentification — Admin Web
1. Objectif

L'application Admin utilise l'authentification JWT fournie par le backend NestJS.

Le frontend Vue ne valide jamais lui-même les identifiants.

La vérification est effectuée par NestJS.

2. Flux de connexion
Utilisateur
    ↓
LoginView
    ↓
POST /api/auth/login
    ↓
NestJS
    ↓
Validation des identifiants
    ↓
JWT
    ↓
Vue Admin
    ↓
Auth Store
    ↓
Role Hub
    ↓
Dashboard correspondant
3. Connexion

La page de connexion collecte :

email ou identifiant ;
mot de passe.

Elle appelle :

POST /api/auth/login

Le frontend doit utiliser le contrat réel fourni par NestJS.

Ne pas modifier le contrat API côté frontend sans accord préalable.

4. Token JWT

Après une authentification réussie, le backend fournit un access token JWT.

Le token est utilisé pour les requêtes protégées.

Authorization: Bearer <accessToken>

Axios doit ajouter automatiquement ce header aux requêtes concernées.

5. Auth Store

Le store d'authentification doit centraliser :

user
accessToken
refreshToken
isAuthenticated
role

Il doit également fournir les opérations :

login()
logout()
restoreSession()
6. Restauration de session

Au démarrage de l'application :

Application
   ↓
Auth Store
   ↓
Recherche de session
   ↓
Session valide ?
   ├── Oui → utilisateur authentifié
   └── Non → Login

L'utilisateur ne doit pas être considéré comme authentifié uniquement parce qu'un token existe localement.

La validité de la session doit être cohérente avec le backend.

7. Axios Interceptor

Les requêtes protégées doivent automatiquement recevoir :

Authorization: Bearer <accessToken>

Le code métier ne doit pas répéter manuellement cette logique dans chaque appel API.

8. Expiration du token

Lorsqu'une API retourne une erreur d'authentification liée à l'expiration du token, l'application doit appliquer la stratégie définie par le backend :

utiliser le refresh token si cette fonctionnalité est disponible ;
renouveler la session ;
sinon déconnecter l'utilisateur ;
rediriger vers /login.
9. Déconnexion

Lors de la déconnexion :

logout()
   ↓
Suppression de la session locale
   ↓
Auth Store → utilisateur non authentifié
   ↓
Redirect /login

L'utilisateur ne doit plus pouvoir accéder aux routes protégées.

10. Sécurité

Le frontend ne doit jamais contenir :

mot de passe utilisateur ;
secret JWT ;
mot de passe PostgreSQL ;
credentials administratifs backend.

Les secrets backend restent exclusivement côté serveur.

11. Source de vérité

Le backend NestJS est la source de vérité concernant :

l'identité de l'utilisateur ;
le rôle ;
les permissions ;
la validité du JWT.

Vue utilise ces informations pour gérer l'interface et la navigation.

Les contrôles d'autorisation doivent être appliqués également dans NestJS.