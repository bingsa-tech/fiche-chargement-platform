
////// script sql  de verification des user online /////

SELECT
    id,
    utilisateur_id,
    device_type,
    connected_at,
    last_seen_at,
    expires_at,
    revoked_at,
    CASE
        WHEN revoked_at IS NOT NULL THEN 'REVOQUEE'
        WHEN expires_at <= NOW() THEN 'EXPIREE'
        WHEN last_seen_at < NOW() - INTERVAL '90 seconds' THEN 'INACTIVE'
        ELSE 'EN LIGNE'
    END AS statut
FROM public.sessions
ORDER BY last_seen_at DESC;

///// vérifier la détection automatique du hors ligne /////



SELECT
    utilisateur_id,
    last_seen_at,
    NOW() AS heure_actuelle,
    EXTRACT(EPOCH FROM (NOW() - last_seen_at))::INTEGER
        AS secondes_inactivite,
    CASE
        WHEN revoked_at IS NOT NULL THEN 'REVOQUEE'
        WHEN expires_at <= NOW() THEN 'EXPIREE'
        WHEN last_seen_at < NOW() - INTERVAL '90 seconds'
            THEN 'HORS LIGNE'
        ELSE 'EN LIGNE'
    END AS statut
FROM public.sessions
WHERE id = 'b7fac4d8-1714-47f0-a84f-4bc18d847e71';


SELECT
    id,
    utilisateur_id,
    last_seen_at,
    NOW() AS heure_actuelle,
    EXTRACT(EPOCH FROM (NOW() - last_seen_at)) AS secondes_inactivite,
    revoked_at
FROM public.sessions
WHERE revoked_at IS NULL
ORDER BY last_seen_at DESC;


//////////////// passage en ligne et hors ligne ////////////

SELECT
    id,
    utilisateur_id,
    last_seen_at,
    EXTRACT(EPOCH FROM (NOW() - last_seen_at))
        AS secondes_inactivite,
    CASE
        WHEN revoked_at IS NOT NULL THEN 'REVOQUEE'
        WHEN expires_at <= NOW() THEN 'EXPIREE'
        WHEN last_seen_at < NOW() - INTERVAL '90 seconds'
            THEN 'HORS LIGNE'
        ELSE 'EN LIGNE'
    END AS statut
FROM public.sessions
ORDER BY connected_at DESC;


///////////////// test hors ligne /////////////////

SELECT
    id,
    utilisateur_id,
    last_seen_at,
    ROUND(
        EXTRACT(EPOCH FROM (NOW() - last_seen_at))::numeric,
        2
    ) AS secondes_inactivite,
    CASE
        WHEN revoked_at IS NOT NULL THEN 'REVOQUEE'
        WHEN expires_at <= NOW() THEN 'EXPIREE'
        WHEN last_seen_at < NOW() - INTERVAL '90 seconds'
            THEN 'HORS LIGNE'
        ELSE 'EN LIGNE'
    END AS statut
FROM public.sessions
ORDER BY connected_at DESC;

///////////// verification ////////////////

SELECT
    id,
    last_seen_at,
    ROUND(
        EXTRACT(EPOCH FROM (NOW() - last_seen_at))::numeric,
        2
    ) AS secondes_inactivite,
    CASE
        WHEN revoked_at IS NOT NULL THEN 'REVOQUEE'
        WHEN expires_at <= NOW() THEN 'EXPIREE'
        WHEN last_seen_at < NOW() - INTERVAL '90 seconds'
            THEN 'HORS LIGNE'
        ELSE 'EN LIGNE'
    END AS statut
FROM public.sessions
WHERE id = 'a196c5db-c709-4ccb-a9a1-0270f1fc6751';