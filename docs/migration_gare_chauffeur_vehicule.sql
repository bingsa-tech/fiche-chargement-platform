-- Migration locale : rattacher chaque chauffeur et véhicule à une gare
-- Base cible : db_fiche_chargement
-- NE PAS exécuter sur Supabase / production.
-- Le script reste dans une transaction : vérifiez les résultats avant COMMIT.

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.gare
    WHERE id = 'b85b7387-decd-4626-abac-80e70d08bbda'::uuid
  ) THEN
    RAISE EXCEPTION 'Migration annulée : Gare Centrale introuvable.';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.chauffeur
    WHERE id = '0707368e-98a8-4144-83d5-97a60e8a1fa9'::uuid
      AND nom = 'TEST' AND prenom = 'Chauffeur'
  ) THEN
    RAISE EXCEPTION 'Migration annulée : chauffeur de test attendu introuvable.';
  END IF;

  IF (SELECT COUNT(*) FROM public.vehicule
      WHERE id IN (
        '30cac1dc-f6ca-4f56-b811-50a78685b5cc'::uuid,
        '5530fb55-d0d4-4c74-8772-d7867c458de3'::uuid,
        '1916db58-bdf4-4988-83d3-eb5e187b3ea8'::uuid,
        '18273fbf-b423-4dc0-a151-a1e4ca2e96fb'::uuid
      )) <> 4 THEN
    RAISE EXCEPTION 'Migration annulée : les quatre véhicules de test attendus ne sont pas tous présents.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name IN ('chauffeur', 'vehicule')
      AND column_name = 'gare_id'
  ) THEN
    RAISE EXCEPTION 'Migration annulée : gare_id existe déjà dans chauffeur ou vehicule.';
  END IF;
END $$;

ALTER TABLE public.chauffeur ADD COLUMN gare_id uuid;
ALTER TABLE public.vehicule ADD COLUMN gare_id uuid;

UPDATE public.chauffeur
SET gare_id = 'b85b7387-decd-4626-abac-80e70d08bbda'::uuid
WHERE id = '0707368e-98a8-4144-83d5-97a60e8a1fa9'::uuid;

UPDATE public.vehicule
SET gare_id = 'b85b7387-decd-4626-abac-80e70d08bbda'::uuid
WHERE id IN (
  '30cac1dc-f6ca-4f56-b811-50a78685b5cc'::uuid, -- CE-1234-AA
  '5530fb55-d0d4-4c74-8772-d7867c458de3'::uuid, -- CE-1235-AA
  '1916db58-bdf4-4988-83d3-eb5e187b3ea8'::uuid, -- CE-1834-AB
  '18273fbf-b423-4dc0-a151-a1e4ca2e96fb'::uuid  -- LT-12548
);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.chauffeur WHERE gare_id IS NULL) THEN
    RAISE EXCEPTION 'Migration annulée : au moins un chauffeur n''a pas de gare.';
  END IF;
  IF EXISTS (SELECT 1 FROM public.vehicule WHERE gare_id IS NULL) THEN
    RAISE EXCEPTION 'Migration annulée : au moins un véhicule n''a pas de gare.';
  END IF;
END $$;

ALTER TABLE public.chauffeur ALTER COLUMN gare_id SET NOT NULL;
ALTER TABLE public.vehicule ALTER COLUMN gare_id SET NOT NULL;

ALTER TABLE public.chauffeur
  ADD CONSTRAINT fk_chauffeur_gare
  FOREIGN KEY (gare_id) REFERENCES public.gare(id)
  ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE public.vehicule
  ADD CONSTRAINT fk_vehicule_gare
  FOREIGN KEY (gare_id) REFERENCES public.gare(id)
  ON UPDATE RESTRICT ON DELETE RESTRICT;

CREATE INDEX idx_chauffeur_gare_id ON public.chauffeur(gare_id);
CREATE INDEX idx_vehicule_gare_id ON public.vehicule(gare_id);

SELECT c.id, c.nom, c.prenom, g.nom AS gare
FROM public.chauffeur c
JOIN public.gare g ON g.id = c.gare_id
ORDER BY c.nom, c.prenom;

SELECT v.id, v.plaque_immatriculation, v.statut, g.nom AS gare
FROM public.vehicule v
JOIN public.gare g ON g.id = v.gare_id
ORDER BY v.plaque_immatriculation;

-- Examinez les résultats. Ensuite, tapez COMMIT; pour enregistrer
-- ou ROLLBACK; pour annuler. Ne pas valider sans vérifier les résultats.
