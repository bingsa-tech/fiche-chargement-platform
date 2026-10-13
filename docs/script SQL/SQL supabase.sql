-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.alerte_document (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  type_document character varying NOT NULL,
  document_id uuid NOT NULL,
  proprietaire_type character varying NOT NULL CHECK (proprietaire_type::text = ANY (ARRAY['CHAUFFEUR'::character varying::text, 'VEHICULE'::character varying::text])),
  proprietaire_id uuid NOT NULL,
  date_declenchement date NOT NULL,
  date_expiration date NOT NULL,
  type_alerte character varying NOT NULL,
  statut character varying NOT NULL,
  date_lecture timestamp without time zone,
  utilisateur_lecture integer,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT alerte_document_pkey PRIMARY KEY (id),
  CONSTRAINT fk_alerte_utilisateur_lecture FOREIGN KEY (utilisateur_lecture) REFERENCES public.utilisateur(id)
);
CREATE TABLE public.audit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  utilisateur_id integer,
  action character varying NOT NULL,
  entite character varying NOT NULL,
  entite_id uuid NOT NULL,
  date_heure timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ancienne_valeur jsonb,
  nouvelle_valeur jsonb,
  appareil_id character varying,
  CONSTRAINT audit_log_pkey PRIMARY KEY (id),
  CONSTRAINT fk_audit_utilisateur FOREIGN KEY (utilisateur_id) REFERENCES public.utilisateur(id)
);
CREATE TABLE public.chauffeur (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nom character varying NOT NULL,
  prenom character varying NOT NULL,
  telephone character varying,
  statut character varying NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chauffeur_pkey PRIMARY KEY (id)
);
CREATE TABLE public.destination (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code character varying NOT NULL UNIQUE,
  nom character varying NOT NULL,
  ville character varying NOT NULL,
  pays character varying NOT NULL,
  statut character varying NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT destination_pkey PRIMARY KEY (id)
);
CREATE TABLE public.document_chauffeur (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  chauffeur_id uuid NOT NULL,
  type_document character varying NOT NULL,
  numero_document character varying,
  date_delivrance date,
  date_expiration date NOT NULL,
  statut character varying NOT NULL,
  observations text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT document_chauffeur_pkey PRIMARY KEY (id),
  CONSTRAINT fk_document_chauffeur FOREIGN KEY (chauffeur_id) REFERENCES public.chauffeur(id)
);
CREATE TABLE public.document_vehicule (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  vehicule_id uuid NOT NULL,
  type_document character varying NOT NULL,
  numero_document character varying,
  date_delivrance date,
  date_expiration date NOT NULL,
  statut character varying NOT NULL,
  observations text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT document_vehicule_pkey PRIMARY KEY (id),
  CONSTRAINT fk_document_vehicule FOREIGN KEY (vehicule_id) REFERENCES public.vehicule(id)
);
CREATE TABLE public.fiche (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reference character varying NOT NULL UNIQUE,
  gare_id uuid NOT NULL,
  vehicule_id uuid NOT NULL,
  chauffeur_id uuid NOT NULL,
  destination_id uuid NOT NULL,
  itineraire_id uuid,
  createur_id integer NOT NULL,
  finalisateur_id integer,
  annulateur_id integer,
  date_creation timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  heure_arrivee_gare timestamp without time zone,
  heure_depart timestamp without time zone,
  heure_arrivee_destination timestamp without time zone,
  date_finalisation timestamp without time zone,
  date_cloture timestamp without time zone,
  date_annulation timestamp without time zone,
  statut USER-DEFINED NOT NULL DEFAULT 'BROUILLON'::fiche_statut,
  motif_annulation text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_reception_chauffeur timestamp without time zone,
  date_chargement timestamp without time zone,
  date_vehicule_rempli timestamp without time zone,
  date_passagers_installes timestamp without time zone,
  numero_bordereau character varying NOT NULL DEFAULT lpad((nextval('bordereau_route_seq'::regclass))::text, 6, '0'::text) UNIQUE,
  CONSTRAINT fiche_pkey PRIMARY KEY (id),
  CONSTRAINT fk_fiche_annulateur FOREIGN KEY (annulateur_id) REFERENCES public.utilisateur(id),
  CONSTRAINT fk_fiche_chauffeur FOREIGN KEY (chauffeur_id) REFERENCES public.chauffeur(id),
  CONSTRAINT fk_fiche_createur FOREIGN KEY (createur_id) REFERENCES public.utilisateur(id),
  CONSTRAINT fk_fiche_destination FOREIGN KEY (destination_id) REFERENCES public.destination(id),
  CONSTRAINT fk_fiche_finalisateur FOREIGN KEY (finalisateur_id) REFERENCES public.utilisateur(id),
  CONSTRAINT fk_fiche_gare FOREIGN KEY (gare_id) REFERENCES public.gare(id),
  CONSTRAINT fk_fiche_itineraire FOREIGN KEY (itineraire_id) REFERENCES public.itineraire(id),
  CONSTRAINT fk_fiche_vehicule FOREIGN KEY (vehicule_id) REFERENCES public.vehicule(id)
);
CREATE TABLE public.fiche_impression (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  fiche_id uuid NOT NULL,
  imprimeur_id integer NOT NULL,
  date_impression timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  numero_exemplaire integer NOT NULL DEFAULT 1 CHECK (numero_exemplaire > 0),
  motif_reimpression text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fiche_impression_pkey PRIMARY KEY (id),
  CONSTRAINT fk_fiche_impression_fiche FOREIGN KEY (fiche_id) REFERENCES public.fiche(id),
  CONSTRAINT fk_fiche_impression_imprimeur FOREIGN KEY (imprimeur_id) REFERENCES public.utilisateur(id)
);
CREATE TABLE public.fiche_passager (
  fiche_id uuid NOT NULL,
  passager_id uuid NOT NULL,
  numero_place integer CHECK (numero_place IS NULL OR numero_place > 0),
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tarif numeric,
  observations text DEFAULT 'NOT NULL'::text,
  CONSTRAINT fk_fiche_passager_fiche FOREIGN KEY (fiche_id) REFERENCES public.fiche(id),
  CONSTRAINT fk_fiche_passager_passager FOREIGN KEY (passager_id) REFERENCES public.passager(id)
);
CREATE TABLE public.fiche_remise (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  fiche_id uuid NOT NULL,
  remise_par_id integer NOT NULL,
  date_remise timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  observation text,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fiche_remise_pkey PRIMARY KEY (id),
  CONSTRAINT fk_fiche_remise_fiche FOREIGN KEY (fiche_id) REFERENCES public.fiche(id),
  CONSTRAINT fk_fiche_remise_utilisateur FOREIGN KEY (remise_par_id) REFERENCES public.utilisateur(id)
);
CREATE TABLE public.gare (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code character varying NOT NULL UNIQUE,
  nom character varying NOT NULL,
  ville character varying NOT NULL,
  adresse character varying,
  statut character varying NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  latitude double precision,
  longitude double precision,
  CONSTRAINT gare_pkey PRIMARY KEY (id)
);
CREATE TABLE public.itineraire (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  destination_id uuid NOT NULL,
  code character varying NOT NULL,
  libelle character varying NOT NULL,
  description text,
  statut character varying NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT itineraire_pkey PRIMARY KEY (id),
  CONSTRAINT fk_itineraire_destination FOREIGN KEY (destination_id) REFERENCES public.destination(id)
);
CREATE TABLE public.passager (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nom character varying NOT NULL,
  prenom character varying NOT NULL,
  numero_cni character varying NOT NULL UNIQUE,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  telephone character varying,
  CONSTRAINT passager_pkey PRIMARY KEY (id)
);
CREATE TABLE public.proprietaire (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nom character varying NOT NULL,
  prenom character varying NOT NULL,
  telephone character varying NOT NULL,
  adresse character varying,
  numero_piece_identite character varying,
  type_piece_identite character varying,
  statut character varying NOT NULL DEFAULT 'ACTIF'::character varying,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT proprietaire_pkey PRIMARY KEY (id)
);
CREATE TABLE public.refresh_token (
  id integer NOT NULL DEFAULT nextval('refresh_token_id_seq'::regclass),
  user_id integer NOT NULL,
  token_hash character varying NOT NULL UNIQUE,
  expires_at timestamp without time zone NOT NULL,
  revoked_at timestamp without time zone,
  replaced_by_token_id integer,
  user_agent character varying,
  ip_address character varying,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT refresh_token_pkey PRIMARY KEY (id),
  CONSTRAINT fk_refresh_token_user FOREIGN KEY (user_id) REFERENCES public.utilisateur(id)
);
CREATE TABLE public.role (
  actif boolean NOT NULL DEFAULT true,
  code character varying NOT NULL UNIQUE,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  description text,
  libelle character varying NOT NULL,
  id integer NOT NULL DEFAULT nextval('role_id_seq'::regclass),
  CONSTRAINT role_pkey PRIMARY KEY (id)
);
CREATE TABLE public.sync_queue (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  entity_type character varying NOT NULL,
  entity_id uuid NOT NULL,
  operation character varying NOT NULL,
  payload text NOT NULL,
  status character varying NOT NULL,
  retry_count integer NOT NULL DEFAULT 0 CHECK (retry_count >= 0),
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_attempt_at timestamp without time zone,
  last_error text,
  CONSTRAINT sync_queue_pkey PRIMARY KEY (id)
);
CREATE TABLE public.utilisateur (
  actif boolean NOT NULL DEFAULT true,
  bloque boolean NOT NULL DEFAULT false,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  email character varying NOT NULL UNIQUE,
  last_login_at timestamp without time zone,
  nom character varying NOT NULL,
  password_hash character varying NOT NULL,
  prenom character varying NOT NULL,
  telephone character varying,
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  username character varying NOT NULL UNIQUE,
  id integer NOT NULL DEFAULT nextval('utilisateur_id_seq'::regclass),
  gare_id uuid,
  role_id integer,
  CONSTRAINT utilisateur_pkey PRIMARY KEY (id),
  CONSTRAINT FK_332c39ebc87e25e15a3e80aab48 FOREIGN KEY (role_id) REFERENCES public.role(id),
  CONSTRAINT fk_utilisateur_gare FOREIGN KEY (gare_id) REFERENCES public.gare(id)
);
CREATE TABLE public.vehicule (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  plaque_immatriculation character varying NOT NULL UNIQUE,
  type character varying NOT NULL,
  marque character varying,
  modele character varying,
  capacite integer NOT NULL CHECK (capacite > 0),
  statut character varying NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  proprietaire_id uuid,
  CONSTRAINT vehicule_pkey PRIMARY KEY (id),
  CONSTRAINT fk_vehicule_proprietaire FOREIGN KEY (proprietaire_id) REFERENCES public.proprietaire(id)
);