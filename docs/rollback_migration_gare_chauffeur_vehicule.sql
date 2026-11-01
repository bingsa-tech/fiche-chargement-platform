-- Rollback local : retire les colonnes gare_id et leurs affectations.
-- Ne supprime ni chauffeurs, ni véhicules, ni gares.

BEGIN;

DROP INDEX IF EXISTS public.idx_chauffeur_gare_id;
DROP INDEX IF EXISTS public.idx_vehicule_gare_id;

ALTER TABLE public.chauffeur DROP CONSTRAINT IF EXISTS fk_chauffeur_gare;
ALTER TABLE public.vehicule DROP CONSTRAINT IF EXISTS fk_vehicule_gare;

ALTER TABLE public.chauffeur DROP COLUMN IF EXISTS gare_id;
ALTER TABLE public.vehicule DROP COLUMN IF EXISTS gare_id;

SELECT table_name, column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('chauffeur', 'vehicule')
  AND column_name = 'gare_id';

-- Résultat attendu : 0 ligne. Puis COMMIT; pour confirmer le rollback.
