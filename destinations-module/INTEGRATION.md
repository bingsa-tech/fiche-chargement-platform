# Intégration du module Destinations

## 1. Copier les fichiers
Copier les dossiers `api`, `types`, `stores`, `components/destinations` et `views/destinations` dans `apps/admin/src/` en fusionnant les dossiers existants.

## 2. Vérifier l'instance Axios
Le fichier `src/api/destinations.api.ts` importe `api` depuis `./axios`. Votre `src/api/axios.ts` doit donc exporter l'instance configurée par défaut (`export default api`). Ne remplacez pas votre instance Axios existante.

**Préfixe API :** les appels utilisent `/api/destinations`, puisque le backend expose `@Controller('destinations')` et que l'application NestJS utilise le préfixe global `/api`. Si votre `baseURL` inclut déjà `/api`, retirez `/api` de `RESOURCE` pour éviter un double préfixe.

## 3. Ajouter les routes dans `src/router/index.ts`
Dans les `children` de la route protégée `/`, ajouter le bloc suivant, idéalement près de la section ITINÉRAIRES :

```ts
// DESTINATIONS
{
  path: 'destinations',
  name: 'destinations',
  component: () => import('../views/destinations/DestinationsListView.vue'),
  meta: { roles: ['ADMIN', 'RESPONSABLE_GARE', 'CONTROLEUR', 'AGENT', 'AUTORITE_HABILITEE'] satisfies UserRole[] },
},
{
  path: 'destinations/nouvelle',
  name: 'destination-create',
  component: () => import('../views/destinations/DestinationFormView.vue'),
  meta: { roles: ['ADMIN', 'RESPONSABLE_GARE'] satisfies UserRole[] },
},
{
  path: 'destinations/:id/modifier',
  name: 'destination-edit',
  component: () => import('../views/destinations/DestinationFormView.vue'),
  meta: { roles: ['ADMIN', 'RESPONSABLE_GARE'] satisfies UserRole[] },
},
{
  path: 'destinations/:id',
  name: 'destination-detail',
  component: () => import('../views/destinations/DestinationDetailsView.vue'),
  meta: { roles: ['ADMIN', 'RESPONSABLE_GARE', 'CONTROLEUR', 'AGENT', 'AUTORITE_HABILITEE'] satisfies UserRole[] },
},
```

L'ordre est important : les routes `nouvelle` et `:id/modifier` doivent être déclarées avant `:id`.

## 4. Droits appliqués
- READ : ADMIN, RESPONSABLE_GARE, CONTROLEUR, AGENT, AUTORITE_HABILITEE.
- CREATE : ADMIN, RESPONSABLE_GARE.
- UPDATE : ADMIN, RESPONSABLE_GARE.
- DELETE : ADMIN uniquement.

Le composant de liste masque les commandes de création/modification/suppression selon le rôle. Le routeur protège les pages et les guards NestJS restent l'autorité finale.

## 5. Attention à la suppression
Le service backend effectue une suppression physique. Les clés étrangères `fiche.destination_id` et `itineraire.destination_id` sont en `ON DELETE RESTRICT`. Une destination déjà référencée ne pourra donc pas être supprimée. Le message d'erreur backend est affiché dans la page.

## 6. Vérification
Depuis `apps/admin` :

```powershell
npm run build
```

Puis tester avec les cinq rôles :
- tous les rôles : consulter liste et détail ;
- ADMIN et RESPONSABLE_GARE : créer et modifier ;
- ADMIN uniquement : supprimer ;
- les autres rôles ne doivent pas pouvoir contourner le backend en appelant directement l'API.

## Hypothèses de contrat à confirmer
Les types supposent que l'API renvoie directement un objet ou un tableau JSON, et que les dates sont exposées sous `createdAt` et `updatedAt` (convention TypeORM). Si votre API encapsule les données dans `{ data: ... }` ou renvoie `created_at`/`updated_at`, adaptez les types et les fonctions API en conséquence.
