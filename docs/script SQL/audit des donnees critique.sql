PS B:\projects\fiche-chargement-platform\backup> psql `
>>   -h aws-0-us-west-2.pooler.supabase.com `
>>   -p 5432 `
>>   -U postgres.fwbavkzhkigmalcuzrpt `
>>   -d postgres `
>>   -c "SELECT COUNT(*) AS documents FROM document_vehicule; SELECT COUNT(*) AS refresh_tokens FROM refresh_token;"
 documents
-----------
         0
(1 ligne)


 refresh_tokens
----------------
              0
(1 ligne)


PS B:\projects\fiche-chargement-platform\backup> psql `
>>   -h aws-0-us-west-2.pooler.supabase.com `
>>   -p 5432 `
>>   -U postgres.fwbavkzhkigmalcuzrpt `
>>   -d postgres `
>>   -f .\missing_data_full.sql
SET
SET
SET
SET
SET
 set_config
------------

(1 ligne)


SET
SET
SET
SET
COPY 3
COPY 94
 setval
--------
    112
(1 ligne)


PS B:\projects\fiche-chargement-platform\backup> psql `
>>   -h aws-0-us-west-2.pooler.supabase.com `
>>   -p 5432 `
>>   -U postgres.fwbavkzhkigmalcuzrpt `
>>   -d postgres `
>>   -c "SELECT COUNT(*) AS documents FROM document_vehicule; SELECT COUNT(*) AS refresh_tokens FROM refresh_token;"
 documents
-----------
         3
(1 ligne)


 refresh_tokens
----------------
             94
(1 ligne)


PS B:\projects\fiche-chargement-platform\backup> psql `
>>   -h aws-0-us-west-2.pooler.supabase.com `
>>   -p 5432 `
>>   -U postgres.fwbavkzhkigmalcuzrpt `
>>   -d postgres `
>>   -c "SELECT v.plaque_immatriculation, COUNT(dv.id) AS nombre_documents FROM vehicule v LEFT JOIN document_vehicule dv ON dv.vehicule_id = v.id GROUP BY v.id, v.plaque_immatriculation ORDER BY v.plaque_immatriculation;"
 plaque_immatriculation | nombre_documents
------------------------+------------------
 CE-1234-AA             |                1
 CE-1235-AA             |                1
 CE-1834-AB             |                1
 LT-12548               |                0
(4 lignes)



Étape 1 — Comptage des 19 tables en LOCAL
psql `
  -h localhost `
  -p 5432 `
  -U postgres `
  -d db_fiche_chargement `
  -c "
SELECT 'alerte_document' AS table_name, COUNT(*) AS row_count_local FROM public.alerte_document
UNION ALL
SELECT 'audit_log', COUNT(*) FROM public.audit_log
UNION ALL
SELECT 'chauffeur', COUNT(*) FROM public.chauffeur
UNION ALL
SELECT 'destination', COUNT(*) FROM public.destination
UNION ALL
SELECT 'document_chauffeur', COUNT(*) FROM public.document_chauffeur
UNION ALL
SELECT 'document_vehicule', COUNT(*) FROM public.document_vehicule
UNION ALL
SELECT 'fiche', COUNT(*) FROM public.fiche
UNION ALL
SELECT 'fiche_impression', COUNT(*) FROM public.fiche_impression
UNION ALL
SELECT 'fiche_passager', COUNT(*) FROM public.fiche_passager
UNION ALL
SELECT 'fiche_remise', COUNT(*) FROM public.fiche_remise
UNION ALL
SELECT 'gare', COUNT(*) FROM public.gare
UNION ALL
SELECT 'itineraire', COUNT(*) FROM public.itineraire
UNION ALL
SELECT 'passager', COUNT(*) FROM public.passager
UNION ALL
SELECT 'proprietaire', COUNT(*) FROM public.proprietaire
UNION ALL
SELECT 'refresh_token', COUNT(*) FROM public.refresh_token
UNION ALL
SELECT 'role', COUNT(*) FROM public.role
UNION ALL
SELECT 'sync_queue', COUNT(*) FROM public.sync_queue
UNION ALL
SELECT 'utilisateur', COUNT(*) FROM public.utilisateur
UNION ALL
SELECT 'vehicule', COUNT(*) FROM public.vehicule
ORDER BY table_name;
"
     table_name     | row_count_local
--------------------+-----------------
 alerte_document    |               0
 audit_log          |               0
 chauffeur          |               0
 destination        |               0
 document_chauffeur |               0
 document_vehicule  |               3
 fiche              |               0
 fiche_impression   |               0
 fiche_passager     |               0
 fiche_remise       |               0
 gare               |               4
 itineraire         |               0
 passager           |               0
 proprietaire       |               1
 refresh_token      |              94
 role               |               5
 sync_queue         |               0
 utilisateur        |               6
 vehicule           |               4
(19 lignes)



Étape 2 — Comptage des 19 tables sur SUPABASE
psql `
  -h aws-0-us-west-2.pooler.supabase.com `
  -p 5432 `
  -U postgres.fwbavkzhkigmalcuzrpt `
  -d postgres `
  -c "
SELECT 'alerte_document' AS table_name, COUNT(*) AS row_count_supabase FROM public.alerte_document
UNION ALL
SELECT 'audit_log', COUNT(*) FROM public.audit_log
UNION ALL
SELECT 'chauffeur', COUNT(*) FROM public.chauffeur
UNION ALL
SELECT 'destination', COUNT(*) FROM public.destination
UNION ALL
SELECT 'document_chauffeur', COUNT(*) FROM public.document_chauffeur
UNION ALL
SELECT 'document_vehicule', COUNT(*) FROM public.document_vehicule
UNION ALL
SELECT 'fiche', COUNT(*) FROM public.fiche
UNION ALL
SELECT 'fiche_impression', COUNT(*) FROM public.fiche_impression
UNION ALL
SELECT 'fiche_passager', COUNT(*) FROM public.fiche_passager
UNION ALL
SELECT 'fiche_remise', COUNT(*) FROM public.fiche_remise
UNION ALL
SELECT 'gare', COUNT(*) FROM public.gare
UNION ALL
SELECT 'itineraire', COUNT(*) FROM public.itineraire
UNION ALL
SELECT 'passager', COUNT(*) FROM public.passager
UNION ALL
SELECT 'proprietaire', COUNT(*) FROM public.proprietaire
UNION ALL
SELECT 'refresh_token', COUNT(*) FROM public.refresh_token
UNION ALL
SELECT 'role', COUNT(*) FROM public.role
UNION ALL
SELECT 'sync_queue', COUNT(*) FROM public.sync_queue
UNION ALL
SELECT 'utilisateur', COUNT(*) FROM public.utilisateur
UNION ALL
SELECT 'vehicule', COUNT(*) FROM public.vehicule
ORDER BY table_name;
"

     table_name     | row_count_supabase
--------------------+--------------------
 alerte_document    |                  0
 audit_log          |                  0
 chauffeur          |                  0
 destination        |                  0
 document_chauffeur |                  0
 document_vehicule  |                  3
 fiche              |                  0
 fiche_impression   |                  0
 fiche_passager     |                  0
 fiche_remise       |                  0
 gare               |                  4
 itineraire         |                  0
 passager           |                  0
 proprietaire       |                  1
 refresh_token      |                 94
 role               |                  5
 sync_queue         |                  0
 utilisateur        |                  6
 vehicule           |                  4
(19 lignes)

1.1 Audit FK des documents véhicule

psql `
  -h aws-0-us-west-2.pooler.supabase.com `
  -p 5432 `
  -U postgres.fwbavkzhkigmalcuzrpt `
  -d postgres `
  -c "
SELECT COUNT(*) AS documents_orphelins
FROM document_vehicule dv
LEFT JOIN vehicule v ON v.id = dv.vehicule_id
WHERE v.id IS NULL;
"


1.2 Audit FK des utilisateurs
psql `
  -h aws-0-us-west-2.pooler.supabase.com `
  -p 5432 `
  -U postgres.fwbavkzhkigmalcuzrpt `
  -d postgres `
  -c "
SELECT COUNT(*) AS utilisateurs_orphelins
FROM utilisateur u
LEFT JOIN role r ON r.id = u.role_id
WHERE r.id IS NULL;
"


1.3 Audit FK des gares

psql `
  -h aws-0-us-west-2.pooler.supabase.com `
  -p 5432 `
  -U postgres.fwbavkzhkigmalcuzrpt `
  -d postgres `
  -c "
SELECT COUNT(*) AS utilisateurs_gare_orphelins
FROM utilisateur u
LEFT JOIN gare g ON g.id = u.gare_id
WHERE u.gare_id IS NOT NULL
  AND g.id IS NULL;
"

1.3 Audit FK des véhicules → propriétaires

psql `
  -h aws-0-us-west-2.pooler.supabase.com `
  -p 5432 `
  -U postgres.fwbavkzhkigmalcuzrpt `
  -d postgres `
  -c "
SELECT COUNT(*) AS vehicules_proprietaire_orphelins
FROM vehicule v
LEFT JOIN proprietaire p ON p.id = v.proprietaire_id
WHERE v.proprietaire_id IS NOT NULL
  AND p.id IS NULL;
"

1.4 Audit FK des refresh tokens → utilisateurs

psql `
  -h aws-0-us-west-2.pooler.supabase.com `
  -p 5432 `
  -U postgres.fwbavkzhkigmalcuzrpt `
  -d postgres `
  -c "
SELECT COUNT(*) AS refresh_tokens_orphelins
FROM refresh_token rt
LEFT JOIN utilisateur u ON u.id = rt.user_id
WHERE u.id IS NULL;
"

1.5 Audit FK des documents chauffeur

psql `
  -h aws-0-us-west-2.pooler.supabase.com `
  -p 5432 `
  -U postgres.fwbavkzhkigmalcuzrpt `
  -d postgres `
  -c "
SELECT COUNT(*) AS documents_chauffeur_orphelins
FROM document_chauffeur dc
LEFT JOIN chauffeur c ON c.id = dc.chauffeur_id
WHERE c.id IS NULL;
"



toutes les contraintes FK présentes dans public


psql `
  -h aws-0-us-west-2.pooler.supabase.com `
  -p 5432 `
  -U postgres.fwbavkzhkigmalcuzrpt `
  -d postgres `
  -c "
SELECT
    tc.table_name AS table_enfant,
    kcu.column_name AS colonne_enfant,
    ccu.table_name AS table_parent,
    ccu.column_name AS colonne_parent,
    tc.constraint_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
   AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
   AND ccu.constraint_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;
"



final results for SUPABASE
PS B:\projects\fiche-chargement-platform\backup> psql `
>>   -h aws-0-us-west-2.pooler.supabase.com `
>>   -p 5432 `
>>   -U postgres.fwbavkzhkigmalcuzrpt `
>>   -d postgres `
>>   -c "
>> SELECT COUNT(*) AS documents_orphelins
>> FROM document_vehicule dv
>> LEFT JOIN vehicule v ON v.id = dv.vehicule_id
>> WHERE v.id IS NULL;
>> "
 documents_orphelins
---------------------
                   0
(1 ligne)


PS B:\projects\fiche-chargement-platform\backup> psql `
>>   -h aws-0-us-west-2.pooler.supabase.com `
>>   -p 5432 `
>>   -U postgres.fwbavkzhkigmalcuzrpt `
>>   -d postgres `
>>   -c "
>> SELECT COUNT(*) AS utilisateurs_orphelins
>> FROM utilisateur u
>> LEFT JOIN role r ON r.id = u.role_id
>> WHERE r.id IS NULL;
>> "
 utilisateurs_orphelins
------------------------
                      0
(1 ligne)


PS B:\projects\fiche-chargement-platform\backup> psql `
>>   -h aws-0-us-west-2.pooler.supabase.com `
>>   -p 5432 `
>>   -U postgres.fwbavkzhkigmalcuzrpt `
>>   -d postgres `
>>   -c "
>> SELECT COUNT(*) AS utilisateurs_gare_orphelins
>> FROM utilisateur u
>> LEFT JOIN gare g ON g.id = u.gare_id
>> WHERE u.gare_id IS NOT NULL
>>   AND g.id IS NULL;
>> "
 utilisateurs_gare_orphelins
-----------------------------
                           0
(1 ligne)


PS B:\projects\fiche-chargement-platform\backup> psql `
>>   -h aws-0-us-west-2.pooler.supabase.com `
>>   -p 5432 `
>>   -U postgres.fwbavkzhkigmalcuzrpt `
>>   -d postgres `
>>   -c "
>> SELECT COUNT(*) AS vehicules_proprietaire_orphelins
>> FROM vehicule v
>> LEFT JOIN proprietaire p ON p.id = v.proprietaire_id
>> WHERE v.proprietaire_id IS NOT NULL
>>   AND p.id IS NULL;
>> "
 vehicules_proprietaire_orphelins
----------------------------------
                                0
(1 ligne)


PS B:\projects\fiche-chargement-platform\backup> psql `
>>   -h aws-0-us-west-2.pooler.supabase.com `
>>   -p 5432 `
>>   -U postgres.fwbavkzhkigmalcuzrpt `
>>   -d postgres `
>>   -c "
>> SELECT COUNT(*) AS refresh_tokens_orphelins
>> FROM refresh_token rt
>> LEFT JOIN utilisateur u ON u.id = rt.user_id
>> WHERE u.id IS NULL;
>> "
 refresh_tokens_orphelins
--------------------------
                        0
(1 ligne)


PS B:\projects\fiche-chargement-platform\backup> psql `
>>   -h aws-0-us-west-2.pooler.supabase.com `
>>   -p 5432 `
>>   -U postgres.fwbavkzhkigmalcuzrpt `
>>   -d postgres `
>>   -c "
>> SELECT COUNT(*) AS documents_chauffeur_orphelins
>> FROM document_chauffeur dc
>> LEFT JOIN chauffeur c ON c.id = dc.chauffeur_id
>> WHERE c.id IS NULL;
>> "
 documents_chauffeur_orphelins
-------------------------------
                             0
(1 ligne)


PS B:\projects\fiche-chargement-platform\backup> psql `
>>   -h aws-0-us-west-2.pooler.supabase.com `
>>   -p 5432 `
>>   -U postgres.fwbavkzhkigmalcuzrpt `
>>   -d postgres `
>>   -c "
>> SELECT
>>     tc.table_name AS table_enfant,
>>     kcu.column_name AS colonne_enfant,
>>     ccu.table_name AS table_parent,
>>     ccu.column_name AS colonne_parent,
>>     tc.constraint_name
>> FROM information_schema.table_constraints tc
>> JOIN information_schema.key_column_usage kcu
>>     ON tc.constraint_name = kcu.constraint_name
>>    AND tc.table_schema = kcu.table_schema
>> JOIN information_schema.constraint_column_usage ccu
>>     ON ccu.constraint_name = tc.constraint_name
>>    AND ccu.constraint_schema = tc.table_schema
>> WHERE tc.constraint_type = 'FOREIGN KEY'
>>   AND tc.table_schema = 'public'
>> ORDER BY tc.table_name, tc.constraint_name;
>> "
    table_enfant    |   colonne_enfant    | table_parent | colonne_parent |        constraint_name
--------------------+---------------------+--------------+----------------+--------------------------------
 alerte_document    | utilisateur_lecture | utilisateur  | id             | fk_alerte_utilisateur_lecture
 audit_log          | utilisateur_id      | utilisateur  | id             | fk_audit_utilisateur
 document_chauffeur | chauffeur_id        | chauffeur    | id             | fk_document_chauffeur
 document_vehicule  | vehicule_id         | vehicule     | id             | fk_document_vehicule
 fiche              | annulateur_id       | utilisateur  | id             | fk_fiche_annulateur
 fiche              | chauffeur_id        | chauffeur    | id             | fk_fiche_chauffeur
 fiche              | createur_id         | utilisateur  | id             | fk_fiche_createur
 fiche              | destination_id      | destination  | id             | fk_fiche_destination
 fiche              | finalisateur_id     | utilisateur  | id             | fk_fiche_finalisateur
 fiche              | gare_id             | gare         | id             | fk_fiche_gare
 fiche              | itineraire_id       | itineraire   | id             | fk_fiche_itineraire
 fiche              | vehicule_id         | vehicule     | id             | fk_fiche_vehicule
 fiche_impression   | fiche_id            | fiche        | id             | fk_fiche_impression_fiche
 fiche_impression   | imprimeur_id        | utilisateur  | id             | fk_fiche_impression_imprimeur
 fiche_passager     | fiche_id            | fiche        | id             | fk_fiche_passager_fiche
 fiche_passager     | passager_id         | passager     | id             | fk_fiche_passager_passager
 fiche_remise       | fiche_id            | fiche        | id             | fk_fiche_remise_fiche
 fiche_remise       | remise_par_id       | utilisateur  | id             | fk_fiche_remise_utilisateur
 itineraire         | destination_id      | destination  | id             | fk_itineraire_destination
 refresh_token      | user_id             | utilisateur  | id             | fk_refresh_token_user
 utilisateur        | role_id             | role         | id             | FK_332c39ebc87e25e15a3e80aab48
 utilisateur        | gare_id             | gare         | id             | fk_utilisateur_gare
 vehicule           | proprietaire_id     | proprietaire | id             | fk_vehicule_proprietaire
(23 lignes)


Étape suivante : audit PRIMARY KEY / UNIQUE

PS B:\projects\fiche-chargement-platform\backup> psql `
>>   -h aws-0-us-west-2.pooler.supabase.com `
>>   -p 5432 `
>>   -U postgres.fwbavkzhkigmalcuzrpt `
>>   -d postgres `
>>   -c "
>> SELECT
>>     tc.table_name,
>>     tc.constraint_type,
>>     tc.constraint_name,
>>     string_agg(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) AS colonnes
>> FROM information_schema.table_constraints tc
>> JOIN information_schema.key_column_usage kcu
>>     ON tc.constraint_name = kcu.constraint_name
>>    AND tc.table_schema = kcu.table_schema
>>    AND tc.table_name = kcu.table_name
>> WHERE tc.table_schema = 'public'
>>   AND tc.constraint_type IN ('PRIMARY KEY', 'UNIQUE')
>> GROUP BY
>>     tc.table_name,
>>     tc.constraint_type,
>>     tc.constraint_name
>> ORDER BY
>>     tc.table_name,
>>     tc.constraint_type,
>>     tc.constraint_name;
>> "
     table_name     | constraint_type |           constraint_name           |        colonnes
--------------------+-----------------+-------------------------------------+------------------------
 alerte_document    | PRIMARY KEY     | alerte_document_pkey                | id
 audit_log          | PRIMARY KEY     | audit_log_pkey                      | id
 chauffeur          | PRIMARY KEY     | chauffeur_pkey                      | id
 destination        | PRIMARY KEY     | destination_pkey                    | id
 destination        | UNIQUE          | destination_code_key                | code
 document_chauffeur | PRIMARY KEY     | document_chauffeur_pkey             | id
 document_vehicule  | PRIMARY KEY     | document_vehicule_pkey              | id
 fiche              | PRIMARY KEY     | fiche_pkey                          | id
 fiche              | UNIQUE          | fiche_reference_key                 | reference
 fiche_impression   | PRIMARY KEY     | fiche_impression_pkey               | id
 fiche_passager     | PRIMARY KEY     | fiche_passager_pkey                 | fiche_id, passager_id
 fiche_remise       | PRIMARY KEY     | fiche_remise_pkey                   | id
 gare               | PRIMARY KEY     | gare_pkey                           | id
 gare               | UNIQUE          | gare_code_key                       | code
 itineraire         | PRIMARY KEY     | itineraire_pkey                     | id
 itineraire         | UNIQUE          | uq_itineraire_destination_code      | destination_id, code
 passager           | PRIMARY KEY     | passager_pkey                       | id
 passager           | UNIQUE          | passager_numero_cni_key             | numero_cni
 proprietaire       | PRIMARY KEY     | proprietaire_pkey                   | id
 refresh_token      | PRIMARY KEY     | refresh_token_pkey                  | id
 refresh_token      | UNIQUE          | refresh_token_token_hash_key        | token_hash
 role               | PRIMARY KEY     | PK_b36bcfe02fc8de3c57a8b2391c2      | id
 role               | UNIQUE          | ukc36say97xydpmgigg38qv5l2p         | code
 sync_queue         | PRIMARY KEY     | sync_queue_pkey                     | id
 utilisateur        | PRIMARY KEY     | PK_838f0f99fe900e49ef050030443      | id
 utilisateur        | UNIQUE          | ukkq7nt5wyq9v9lpcpgxag2f24a         | username
 utilisateur        | UNIQUE          | ukrma38wvnqfaf66vvmi57c71lo         | email
 vehicule           | PRIMARY KEY     | vehicule_pkey                       | id
 vehicule           | UNIQUE          | vehicule_plaque_immatriculation_key | plaque_immatriculation
(29 lignes)



3.1 Vérification des séquences
Sequence role

psql `
  -h aws-0-us-west-2.pooler.supabase.com `
  -p 5432 `
  -U postgres.fwbavkzhkigmalcuzrpt `
  -d postgres `
  -c "
SELECT
    (SELECT MAX(id) FROM public.role) AS max_id,
    last_value AS sequence_last_value,
    CASE
        WHEN last_value >= (SELECT MAX(id) FROM public.role)
        THEN 'OK'
        ELSE 'A CORRIGER'
    END AS statut
FROM public.role_id_seq;
"

Séquence utilisateur

psql `
  -h aws-0-us-west-2.pooler.supabase.com `
  -p 5432 `
  -U postgres.fwbavkzhkigmalcuzrpt `
  -d postgres `
  -c "
SELECT
    (SELECT MAX(id) FROM public.utilisateur) AS max_id,
    last_value AS sequence_last_value,
    CASE
        WHEN last_value >= (SELECT MAX(id) FROM public.utilisateur)
        THEN 'OK'
        ELSE 'A CORRIGER'
    END AS statut
FROM public.utilisateur_id_seq;
"


3. Séquence refresh_token
psql `
  -h aws-0-us-west-2.pooler.supabase.com `
  -p 5432 `
  -U postgres.fwbavkzhkigmalcuzrpt `
  -d postgres `
  -c "
SELECT
    (SELECT MAX(id) FROM public.refresh_token) AS max_id,
    last_value AS sequence_last_value,
    CASE
        WHEN last_value >= (SELECT MAX(id) FROM public.refresh_token)
        THEN 'OK'
        ELSE 'A CORRIGER'
    END AS statut
FROM public.refresh_token_id_seq;
"




Étape 4 — Audit des données critiques

les 5 rôles
les utilisateurs
les 4 gares
les 4 véhicules
le propriétaire
les 3 documents véhicule