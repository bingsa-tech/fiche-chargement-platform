--
-- PostgreSQL database dump
--

\restrict qL9ZWcMCfC49ZIdwEAqXrsZnZsBFxZOJ3BTcIgPhBYHNkdLvuNHmvjZqsKqrbeZ

-- Dumped from database version 15.19
-- Dumped by pg_dump version 15.19

-- Started on 2026-11-09 10:57:28

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16458)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 3670 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 3 (class 3079 OID 16806)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3671 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 959 (class 1247 OID 16857)
-- Name: fiche_statut; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.fiche_statut AS ENUM (
    'BROUILLON',
    'EN_ATTENTE',
    'EN_COURS',
    'FINALISEE',
    'IMPRIMEE',
    'REMISE_CHAUFFEUR',
    'RECEPTION_CONFIRME',
    'CHARGEMENT',
    'EN_CIRCULATION',
    'CLOTUREE',
    'ANNULEE'
);


ALTER TYPE public.fiche_statut OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 232 (class 1259 OID 16781)
-- Name: alerte_document; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alerte_document (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type_document character varying(50) NOT NULL,
    document_id uuid NOT NULL,
    proprietaire_type character varying(30) NOT NULL,
    proprietaire_id uuid NOT NULL,
    date_declenchement date NOT NULL,
    date_expiration date NOT NULL,
    type_alerte character varying(30) NOT NULL,
    statut character varying(20) NOT NULL,
    date_lecture timestamp without time zone,
    utilisateur_lecture integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_alerte_dates CHECK ((date_expiration >= date_declenchement)),
    CONSTRAINT chk_alerte_proprietaire_type CHECK (((proprietaire_type)::text = ANY ((ARRAY['CHAUFFEUR'::character varying, 'VEHICULE'::character varying])::text[])))
);


ALTER TABLE public.alerte_document OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16767)
-- Name: audit_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    utilisateur_id integer,
    action character varying(50) NOT NULL,
    entite character varying(50) NOT NULL,
    entite_id character varying(100) NOT NULL,
    date_heure timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ancienne_valeur jsonb,
    nouvelle_valeur jsonb,
    appareil_id character varying(100)
);


ALTER TABLE public.audit_log OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 25012)
-- Name: bordereau_route_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bordereau_route_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bordereau_route_seq OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16534)
-- Name: chauffeur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chauffeur (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    telephone character varying(30),
    statut character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    gare_id uuid NOT NULL
);


ALTER TABLE public.chauffeur OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16558)
-- Name: destination; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.destination (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(30) NOT NULL,
    nom character varying(150) NOT NULL,
    ville character varying(100) NOT NULL,
    pays character varying(100) NOT NULL,
    statut character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.destination OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16542)
-- Name: document_chauffeur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document_chauffeur (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    chauffeur_id uuid NOT NULL,
    type_document character varying(50) NOT NULL,
    numero_document character varying(100),
    date_delivrance date,
    date_expiration date NOT NULL,
    statut character varying(20) NOT NULL,
    observations text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_document_chauffeur_dates CHECK (((date_delivrance IS NULL) OR (date_expiration >= date_delivrance)))
);


ALTER TABLE public.document_chauffeur OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16518)
-- Name: document_vehicule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document_vehicule (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    vehicule_id uuid NOT NULL,
    type_document character varying(50) NOT NULL,
    numero_document character varying(100),
    date_delivrance date,
    date_expiration date NOT NULL,
    statut character varying(20) NOT NULL,
    observations text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_document_vehicule_dates CHECK (((date_delivrance IS NULL) OR (date_expiration >= date_delivrance)))
);


ALTER TABLE public.document_vehicule OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16696)
-- Name: fiche; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fiche (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reference character varying(50) NOT NULL,
    gare_id uuid NOT NULL,
    vehicule_id uuid NOT NULL,
    chauffeur_id uuid NOT NULL,
    destination_id uuid NOT NULL,
    itineraire_id uuid,
    createur_id integer NOT NULL,
    finalisateur_id integer,
    annulateur_id integer,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    heure_arrivee_gare timestamp without time zone,
    heure_depart timestamp without time zone,
    heure_arrivee_destination timestamp without time zone,
    date_finalisation timestamp without time zone,
    date_cloture timestamp without time zone,
    date_annulation timestamp without time zone,
    statut public.fiche_statut DEFAULT 'BROUILLON'::public.fiche_statut NOT NULL,
    motif_annulation text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_reception_chauffeur timestamp without time zone,
    date_chargement timestamp without time zone,
    date_vehicule_rempli timestamp without time zone,
    date_passagers_installes timestamp without time zone,
    numero_bordereau character varying(6) DEFAULT lpad((nextval('public.bordereau_route_seq'::regclass))::text, 6, '0'::text) NOT NULL,
    CONSTRAINT chk_fiche_dates CHECK (((heure_depart IS NULL) OR (heure_arrivee_gare IS NULL) OR (heure_depart >= heure_arrivee_gare)))
);


ALTER TABLE public.fiche OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16891)
-- Name: fiche_impression; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fiche_impression (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fiche_id uuid NOT NULL,
    imprimeur_id integer NOT NULL,
    date_impression timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    numero_exemplaire integer DEFAULT 1 NOT NULL,
    motif_reimpression text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_fiche_impression_numero CHECK ((numero_exemplaire > 0))
);


ALTER TABLE public.fiche_impression OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16750)
-- Name: fiche_passager; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fiche_passager (
    fiche_id uuid NOT NULL,
    passager_id uuid NOT NULL,
    numero_place integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tarif numeric(10,2),
    observations text,
    CONSTRAINT chk_numero_place CHECK (((numero_place IS NULL) OR (numero_place > 0)))
);


ALTER TABLE public.fiche_passager OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16913)
-- Name: fiche_remise; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fiche_remise (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fiche_id uuid NOT NULL,
    remise_par_id integer NOT NULL,
    date_remise timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    observation text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.fiche_remise OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16495)
-- Name: gare; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gare (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(30) NOT NULL,
    nom character varying(150) NOT NULL,
    ville character varying(100) NOT NULL,
    adresse character varying(255),
    statut character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    latitude double precision,
    longitude double precision
);


ALTER TABLE public.gare OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16568)
-- Name: itineraire; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.itineraire (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    destination_id uuid NOT NULL,
    code character varying(30) NOT NULL,
    libelle character varying(150) NOT NULL,
    description text,
    statut character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.itineraire OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16585)
-- Name: passager; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.passager (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    numero_cni character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    telephone character varying(30)
);


ALTER TABLE public.passager OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16838)
-- Name: proprietaire; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proprietaire (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    telephone character varying(30) NOT NULL,
    adresse character varying(255),
    numero_piece_identite character varying(100),
    type_piece_identite character varying(50),
    statut character varying(20) DEFAULT 'ACTIF'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.proprietaire OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16818)
-- Name: refresh_token; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_token (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token_hash character varying(255) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    revoked_at timestamp without time zone,
    replaced_by_token_id integer,
    user_agent character varying(500),
    ip_address character varying(45),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    session_id uuid
);


ALTER TABLE public.refresh_token OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16817)
-- Name: refresh_token_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.refresh_token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.refresh_token_id_seq OWNER TO postgres;

--
-- TOC entry 3672 (class 0 OID 0)
-- Dependencies: 233
-- Name: refresh_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.refresh_token_id_seq OWNED BY public.refresh_token.id;


--
-- TOC entry 216 (class 1259 OID 16400)
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    actif boolean DEFAULT true NOT NULL,
    code character varying(50) NOT NULL,
    created_at timestamp(6) without time zone DEFAULT now() NOT NULL,
    description text,
    libelle character varying(100) NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.role OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16426)
-- Name: role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.role_id_seq OWNER TO postgres;

--
-- TOC entry 3673 (class 0 OID 0)
-- Dependencies: 218
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;


--
-- TOC entry 239 (class 1259 OID 41674)
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    utilisateur_id integer NOT NULL,
    gare_id uuid,
    device_type character varying(10) NOT NULL,
    device_name character varying(255),
    last_seen_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    connected_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT chk_sessions_dates CHECK ((expires_at > connected_at)),
    CONSTRAINT chk_sessions_revoked CHECK (((revoked_at IS NULL) OR (revoked_at >= connected_at))),
    CONSTRAINT sessions_device_type_check CHECK (((device_type)::text = ANY ((ARRAY['WEB'::character varying, 'MOBILE'::character varying])::text[])))
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16659)
-- Name: sync_queue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sync_queue (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    entity_type character varying(50) NOT NULL,
    entity_id uuid NOT NULL,
    operation character varying(20) NOT NULL,
    payload text NOT NULL,
    status character varying(20) NOT NULL,
    retry_count integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_attempt_at timestamp without time zone,
    last_error text,
    CONSTRAINT chk_sync_retry_count CHECK ((retry_count >= 0))
);


ALTER TABLE public.sync_queue OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16408)
-- Name: utilisateur; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilisateur (
    actif boolean DEFAULT true NOT NULL,
    bloque boolean DEFAULT false NOT NULL,
    created_at timestamp(6) without time zone DEFAULT now() NOT NULL,
    email character varying(100) NOT NULL,
    last_login_at timestamp(6) without time zone,
    nom character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    prenom character varying(100) NOT NULL,
    telephone character varying(20),
    updated_at timestamp(6) without time zone DEFAULT now() NOT NULL,
    username character varying(50) NOT NULL,
    id integer NOT NULL,
    gare_id uuid,
    role_id integer
);


ALTER TABLE public.utilisateur OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16438)
-- Name: utilisateur_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilisateur_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.utilisateur_id_seq OWNER TO postgres;

--
-- TOC entry 3674 (class 0 OID 0)
-- Dependencies: 219
-- Name: utilisateur_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilisateur_id_seq OWNED BY public.utilisateur.id;


--
-- TOC entry 221 (class 1259 OID 16507)
-- Name: vehicule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicule (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    plaque_immatriculation character varying(30) NOT NULL,
    type character varying(30) NOT NULL,
    marque character varying(80),
    modele character varying(80),
    capacite integer NOT NULL,
    statut character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    proprietaire_id uuid,
    gare_id uuid NOT NULL,
    CONSTRAINT chk_vehicule_capacite CHECK ((capacite > 0))
);


ALTER TABLE public.vehicule OWNER TO postgres;

--
-- TOC entry 3349 (class 2604 OID 16821)
-- Name: refresh_token id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_token ALTER COLUMN id SET DEFAULT nextval('public.refresh_token_id_seq'::regclass);


--
-- TOC entry 3305 (class 2604 OID 16427)
-- Name: role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);


--
-- TOC entry 3310 (class 2604 OID 16439)
-- Name: utilisateur id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur ALTER COLUMN id SET DEFAULT nextval('public.utilisateur_id_seq'::regclass);


--
-- TOC entry 3657 (class 0 OID 16781)
-- Dependencies: 232
-- Data for Name: alerte_document; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alerte_document (id, type_document, document_id, proprietaire_type, proprietaire_id, date_declenchement, date_expiration, type_alerte, statut, date_lecture, utilisateur_lecture, created_at) FROM stdin;
a38bafc5-4ddb-4bba-9697-35b141984ba2	ASSURANCE	10eb52eb-27a3-4912-b9bf-31b49c166fc3	VEHICULE	30cac1dc-f6ca-4f56-b811-50a78685b5cc	2026-10-23	2026-10-31	ATTENTION	LUE	2026-10-25 21:43:30.256	4	2026-10-23 12:20:04.274375
d5a67d90-c7f5-4381-8f2d-47a9d63bec01	ASSURANCE	b80c1cc0-1b63-4ea4-a9df-48115b6ae524	VEHICULE	c473cf16-d002-451c-a53c-aa870211fa2f	2026-11-01	2026-11-13	ATTENTION	LUE	2026-11-03 18:04:32.085	\N	2026-11-01 21:16:29.123004
acc3c0b2-1820-41f8-ad6b-a98a5ee2c6f2	CARTE BLEU	6149fe48-2629-47e0-8151-38a2ea3a9242	VEHICULE	c473cf16-d002-451c-a53c-aa870211fa2f	2026-11-01	2026-11-20	ATTENTION	LUE	2026-11-03 18:04:33.619	\N	2026-11-01 21:16:29.129593
\.


--
-- TOC entry 3656 (class 0 OID 16767)
-- Dependencies: 231
-- Data for Name: audit_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_log (id, utilisateur_id, action, entite, entite_id, date_heure, ancienne_valeur, nouvelle_valeur, appareil_id) FROM stdin;
79d607b4-8332-4056-ac20-8d5d41ad6f8c	\N	CREATE	VEHICULE	505c1322-b981-4717-a11a-405a30051b95	2026-10-31 21:17:21.719311	\N	{"type": "AUTOBUS", "gareId": "d3b94ae9-279e-43c1-81d7-67d6960734a9", "marque": "Ford", "modele": "Edge", "statut": "ACTIF", "capacite": 22, "proprietaireId": "bfb47b50-6000-42c8-8220-8985ae27f12f", "nombreDocuments": 1, "plaqueImmatriculation": "CE-12310-AA"}	\N
f0b0ee06-20ca-4357-844e-e4c5b4332249	3	CREATE	VEHICULE	88af5bd2-a644-4b2f-9970-f7839a4ba914	2026-10-31 22:17:54.859273	\N	{"type": "AUTOBUS", "gareId": "f4b143b4-fa68-41ea-9d6e-7022d3a1b6f6", "marque": "Subaru", "modele": "Edge", "statut": "ACTIF", "capacite": 22, "proprietaireId": "bfb47b50-6000-42c8-8220-8985ae27f12f", "nombreDocuments": 1, "plaqueImmatriculation": "KO-4585-AA"}	\N
0c191b69-5134-4799-8876-6eec21435581	3	UPDATE	VEHICULE	88af5bd2-a644-4b2f-9970-f7839a4ba914	2026-10-31 22:55:23.316165	{"type": "AUTOBUS", "marque": "Subaru", "modele": "Edge", "statut": "ACTIF", "capacite": 22, "proprietaireId": "bfb47b50-6000-42c8-8220-8985ae27f12f", "plaqueImmatriculation": "KO-4585-AA"}	{"type": "AUTOBUS", "marque": "Subaru", "modele": "Edge", "statut": "ACTIF", "capacite": 22, "proprietaireId": "bfb47b50-6000-42c8-8220-8985ae27f12f", "plaqueImmatriculation": "KO-4585-AA"}	\N
31da5d93-170a-4b96-8dda-7f49d1bdb267	3	DELETE	VEHICULE	88af5bd2-a644-4b2f-9970-f7839a4ba914	2026-10-31 22:55:46.722446	{"type": "AUTOBUS", "marque": "Subaru", "modele": "Edge", "statut": "ACTIF", "capacite": 22, "proprietaireId": "bfb47b50-6000-42c8-8220-8985ae27f12f", "nombreDocuments": 1, "plaqueImmatriculation": "KO-4585-AA"}	\N	\N
a899b29a-a24f-445c-8ddf-17747f8a1219	3	UPDATE	VEHICULE	18273fbf-b423-4dc0-a151-a1e4ca2e96fb	2026-11-01 19:40:02.011562	{"type": "MINI CAR", "gareId": "b85b7387-decd-4626-abac-80e70d08bbda", "marque": "Toyota", "modele": "Sprinter", "statut": "MAINTENANCE", "capacite": 12, "proprietaireId": "bfb47b50-6000-42c8-8220-8985ae27f12f", "plaqueImmatriculation": "LT-12548"}	{"type": "MINI CAR", "gareId": "b85b7387-decd-4626-abac-80e70d08bbda", "marque": "Toyota", "modele": "Sprinter", "statut": "ACTIF", "capacite": 12, "proprietaireId": "bfb47b50-6000-42c8-8220-8985ae27f12f", "plaqueImmatriculation": "LT-12548"}	\N
9cb3365e-12ab-4132-90c2-a461340489a0	3	CREATE	VEHICULE	c473cf16-d002-451c-a53c-aa870211fa2f	2026-11-01 21:06:17.756032	\N	{"type": "BERLINE", "gareId": "b85b7387-decd-4626-abac-80e70d08bbda", "marque": "SUBARU", "modele": "OUTBACK", "statut": "ACTIF", "capacite": 6, "proprietaireId": "77ccafa1-b405-4ced-9094-7a276a45ae43", "nombreDocuments": 2, "plaqueImmatriculation": "LT-12548-DF"}	\N
cc3bb125-2d6c-4538-8aa9-63bd68337bb8	3	DELETE	GARE	415e0c29-47fc-4b18-b52e-32615a6c8a32	2026-11-09 04:21:02.972289	{"id": "415e0c29-47fc-4b18-b52e-32615a6c8a32", "nom": "Gare Sync Test 3", "code": "GARE-SYNC-003", "ville": "Eseka", "gareId": "415e0c29-47fc-4b18-b52e-32615a6c8a32", "statut": "ACTIF", "adresse": "123 Test 3", "latitude": null, "longitude": null}	\N	\N
459d46d6-53b9-4b3a-97b1-30437651882c	3	UPDATE	GARE	d3b94ae9-279e-43c1-81d7-67d6960734a9	2026-11-09 04:38:43.719636	{"id": "d3b94ae9-279e-43c1-81d7-67d6960734a9", "nom": "Gare routiere", "code": "GARE-Eseka", "ville": "Eseka", "gareId": "d3b94ae9-279e-43c1-81d7-67d6960734a9", "statut": "ACTIVE", "adresse": "carrefour marche", "latitude": null, "longitude": null}	{"id": "d3b94ae9-279e-43c1-81d7-67d6960734a9", "nom": "Gare routiere", "code": "GARE-Eseka", "ville": "Eseka", "gareId": "d3b94ae9-279e-43c1-81d7-67d6960734a9", "statut": "INACTIF", "adresse": "carrefour marche", "latitude": null, "longitude": null}	\N
16fb4983-aa76-479f-814f-bf7cd29370d5	3	UPDATE	GARE	d3b94ae9-279e-43c1-81d7-67d6960734a9	2026-11-09 04:57:10.200368	{"id": "d3b94ae9-279e-43c1-81d7-67d6960734a9", "nom": "Gare routiere", "code": "GARE-Eseka", "ville": "Eseka", "gareId": "d3b94ae9-279e-43c1-81d7-67d6960734a9", "statut": "INACTIF", "adresse": "carrefour marche", "latitude": null, "longitude": null}	{"id": "d3b94ae9-279e-43c1-81d7-67d6960734a9", "nom": "Gare routiere", "code": "GARE-Eseka", "ville": "Eseka", "gareId": "d3b94ae9-279e-43c1-81d7-67d6960734a9", "statut": "ACTIF", "adresse": "carrefour marche", "latitude": null, "longitude": null}	\N
bbf94bba-29df-4969-9ee5-b0a65579a9e1	3	CREATE	UTILISATEUR	20	2026-11-09 05:46:30.88475	\N	{"id": 20, "nom": "biloloo ngue", "role": "CONTROLEUR", "actif": true, "email": "bilschool@outlook.com", "bloque": false, "gareId": "b85b7387-decd-4626-abac-80e70d08bbda", "prenom": "samuel", "username": "bilschool@outlook.com", "telephone": "14389248545"}	\N
5e189418-ed74-436a-a483-268d16cb027a	3	UPDATE	UTILISATEUR	4	2026-11-09 05:49:09.766457	{"id": 4, "nom": "Agent", "role": "AGENT", "actif": true, "email": "agent1@gare.com", "bloque": false, "gareId": "d3b94ae9-279e-43c1-81d7-67d6960734a9", "prenom": "Test", "username": "agent1", "telephone": null}	{"id": 4, "nom": "Agent", "role": "AGENT", "actif": true, "email": "agent1@gare.com", "bloque": false, "gareId": "d3b94ae9-279e-43c1-81d7-67d6960734a9", "prenom": "Test", "username": "agent1", "telephone": "56987/1452"}	\N
7629ef7e-a274-4b4d-8b56-eb1dc6fb980a	3	DELETE	UTILISATEUR	13	2026-11-09 05:50:28.732658	{"id": 13, "nom": "BILOLOO", "role": "AUTORITE_HABILITEE", "actif": true, "email": "owenbiloloo@test.ca", "bloque": false, "gareId": "f4b143b4-fa68-41ea-9d6e-7022d3a1b6f6", "prenom": "oWEN", "username": "owen", "telephone": "4692157854"}	\N	\N
a4dcb2cf-6013-4f3f-8a55-ced7f53e5eea	3	UPDATE	CHAUFFEUR	b7268580-2df6-4e42-a1ac-92d82c042d1e	2026-11-09 06:02:10.276534	{"id": "b7268580-2df6-4e42-a1ac-92d82c042d1e", "nom": "ngue", "gareId": "d3b94ae9-279e-43c1-81d7-67d6960734a9", "prenom": "paul", "statut": "ACTIF", "createdAt": "2026-10-21T09:28:58.137Z", "telephone": "5145550123", "updatedAt": "2026-10-21T09:28:58.137Z"}	{"id": "b7268580-2df6-4e42-a1ac-92d82c042d1e", "nom": "ngue ngue", "gareId": "d3b94ae9-279e-43c1-81d7-67d6960734a9", "prenom": "paul", "statut": "ACTIF", "createdAt": "2026-10-21T09:28:58.137Z", "telephone": "5145550123", "updatedAt": "2026-11-09T11:02:10.276Z"}	\N
ca2ea985-479e-4de4-ad27-bb80e12886d0	3	UPDATE	DESTINATION	d3ed83fe-1a92-4e9a-b99d-a1bb77b9a6ef	2026-11-09 06:09:41.837708	{"id": "d3ed83fe-1a92-4e9a-b99d-a1bb77b9a6ef", "nom": "Destination de test", "code": "DEST-TEST-001", "pays": "Cameroun", "ville": "Yaound‚", "statut": "ACTIF", "createdAt": "2026-10-09T02:49:41.285Z", "updatedAt": "2026-10-09T02:49:41.285Z"}	{"id": "d3ed83fe-1a92-4e9a-b99d-a1bb77b9a6ef", "nom": "Destination de test", "code": "DEST-TEST-001", "pays": "Cameroun", "ville": "Yaounde", "statut": "ACTIF", "createdAt": "2026-10-09T02:49:41.285Z", "updatedAt": "2026-11-09T11:09:41.837Z"}	\N
6dd684d3-8b15-4b87-ad71-6416508ae023	3	CREATE	FICHE	4138dae1-16cd-4f31-8696-2095dd2f376f	2026-11-09 06:29:23.810229	\N	{"id": "4138dae1-16cd-4f31-8696-2095dd2f376f", "gareId": "d3b94ae9-279e-43c1-81d7-67d6960734a9", "statut": "EN_ATTENTE", "createdAt": "2026-11-09T11:29:23.810Z", "reference": "FCH-001255555", "updatedAt": "2026-11-09T11:29:23.810Z", "createurId": 3, "vehiculeId": "30cac1dc-f6ca-4f56-b811-50a78685b5cc", "chauffeurId": "b7268580-2df6-4e42-a1ac-92d82c042d1e", "dateCloture": null, "heureDepart": null, "annulateurId": null, "dateCreation": "2026-11-09T11:29:23.810Z", "itineraireId": "25b76889-9131-4e1d-8212-8b40ebda5f21", "destinationId": "d3ed83fe-1a92-4e9a-b99d-a1bb77b9a6ef", "dateAnnulation": null, "finalisateurId": null, "motifAnnulation": null, "numeroBordereau": "000008", "dateFinalisation": null, "heureArriveeGare": null, "heureArriveeDestination": null}	\N
\.


--
-- TOC entry 3648 (class 0 OID 16534)
-- Dependencies: 223
-- Data for Name: chauffeur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chauffeur (id, nom, prenom, telephone, statut, created_at, updated_at, gare_id) FROM stdin;
0707368e-98a8-4144-83d5-97a60e8a1fa9	TEST	Chauffeur	600000000	ACTIF	2026-10-08 22:54:50.875803	2026-10-08 22:54:50.875803	b85b7387-decd-4626-abac-80e70d08bbda
3df2a68a-2a27-480a-b5b1-b7c30459b107	Test	Agent	5145550199	ACTIF	2026-10-23 11:11:18.532089	2026-10-23 11:11:18.532089	d3b94ae9-279e-43c1-81d7-67d6960734a9
b7268580-2df6-4e42-a1ac-92d82c042d1e	ngue ngue	paul	5145550123	ACTIF	2026-10-21 05:28:58.137951	2026-11-09 06:02:10.276534	d3b94ae9-279e-43c1-81d7-67d6960734a9
\.


--
-- TOC entry 3650 (class 0 OID 16558)
-- Dependencies: 225
-- Data for Name: destination; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.destination (id, code, nom, ville, pays, statut, created_at, updated_at) FROM stdin;
ad092e45-3067-4fe6-8a5d-c9412feaf6c9	DST-0002	gare routiere Mboumyebel	Mbouyebel	Cameroun	ACTIF	2026-11-08 20:08:02.630784	2026-11-08 20:08:02.630784
d3ed83fe-1a92-4e9a-b99d-a1bb77b9a6ef	DEST-TEST-001	Destination de test	Yaounde	Cameroun	ACTIF	2026-10-08 22:49:41.285282	2026-11-09 06:09:41.837708
\.


--
-- TOC entry 3649 (class 0 OID 16542)
-- Dependencies: 224
-- Data for Name: document_chauffeur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_chauffeur (id, chauffeur_id, type_document, numero_document, date_delivrance, date_expiration, statut, observations, created_at, updated_at) FROM stdin;
11aa88b5-a648-4dfa-b737-5405bd8a5a3a	b7268580-2df6-4e42-a1ac-92d82c042d1e	PERMIS_CONDUIRE	PERMIS-TEST-021	2024-01-14	2028-01-14	VALIDE	Document de test01	2026-10-21 05:28:58.137951	2026-10-21 05:28:58.137951
e595ef30-6ce9-486f-ad6f-2aa84537bdc4	3df2a68a-2a27-480a-b5b1-b7c30459b107	PERMIS_CONDUIRE	PERMIS-AGENT-TEST-002	2024-01-14	2028-01-14	VALIDE	Test de création par un agent	2026-10-23 11:11:18.532089	2026-10-23 11:11:18.532089
\.


--
-- TOC entry 3647 (class 0 OID 16518)
-- Dependencies: 222
-- Data for Name: document_vehicule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_vehicule (id, vehicule_id, type_document, numero_document, date_delivrance, date_expiration, statut, observations, created_at, updated_at) FROM stdin;
729c86ee-d7d9-4b6a-9030-5b29fbf751e5	30cac1dc-f6ca-4f56-b811-50a78685b5cc	ASSURANCE	ASS-2026-001	2026-01-14	2027-01-14	VALIDE	Document vérifié	2026-09-29 05:26:40.026015	2026-09-29 05:26:40.026015
32ba6690-854b-403f-b2ed-986f4d5f2ee5	5530fb55-d0d4-4c74-8772-d7867c458de3	ASSURANCE	ASS-DD-12	2026-10-12	2027-10-12	VALIDE	\N	2026-09-30 09:07:50.364996	2026-09-30 09:07:50.364996
65641ebf-a966-40d4-ab5a-72768d84af49	1916db58-bdf4-4988-83d3-eb5e187b3ea8	CARTE BLEU	CB-14856	2025-09-14	2030-09-13	VALIDE	\N	2026-09-30 09:10:16.38828	2026-09-30 09:10:16.38828
10eb52eb-27a3-4912-b9bf-31b49c166fc3	30cac1dc-f6ca-4f56-b811-50a78685b5cc	ASSURANCE	TEST-ALERTE-2026	2026-01-01	2026-10-31	VALIDE	Document temporaire pour test du module Alertes	2026-10-23 12:18:55.441483	2026-10-23 12:18:55.441483
ac3101f2-1071-4a6b-80ed-f51fe480a013	505c1322-b981-4717-a11a-405a30051b95	ASSURANCE	ASS-2026-001	2026-01-01	2027-01-01	VALIDE	Document de test	2026-10-31 21:17:21.719311	2026-10-31 21:17:21.719311
b80c1cc0-1b63-4ea4-a9df-48115b6ae524	c473cf16-d002-451c-a53c-aa870211fa2f	ASSURANCE	ASS-2027-581	2025-10-14	2026-11-13	VALIDE	\N	2026-11-01 21:06:17.756032	2026-11-01 21:06:17.756032
6149fe48-2629-47e0-8151-38a2ea3a9242	c473cf16-d002-451c-a53c-aa870211fa2f	CARTE BLEU	CB-258881	2025-10-25	2026-11-20	VALIDE	\N	2026-11-01 21:06:17.756032	2026-11-01 21:06:17.756032
\.


--
-- TOC entry 3654 (class 0 OID 16696)
-- Dependencies: 229
-- Data for Name: fiche; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fiche (id, reference, gare_id, vehicule_id, chauffeur_id, destination_id, itineraire_id, createur_id, finalisateur_id, annulateur_id, date_creation, heure_arrivee_gare, heure_depart, heure_arrivee_destination, date_finalisation, date_cloture, date_annulation, statut, motif_annulation, created_at, updated_at, date_reception_chauffeur, date_chargement, date_vehicule_rempli, date_passagers_installes, numero_bordereau) FROM stdin;
bd1dd13a-8f2a-4265-8937-a0f659d6b7ee	FCH-0002555	f4b143b4-fa68-41ea-9d6e-7022d3a1b6f6	5530fb55-d0d4-4c74-8772-d7867c458de3	b7268580-2df6-4e42-a1ac-92d82c042d1e	d3ed83fe-1a92-4e9a-b99d-a1bb77b9a6ef	\N	3	\N	\N	2026-11-01 13:42:55.880654	\N	\N	\N	\N	\N	\N	EN_ATTENTE	\N	2026-11-01 13:42:55.880654	2026-11-01 13:42:55.880654	\N	\N	\N	\N	000007
4138dae1-16cd-4f31-8696-2095dd2f376f	FCH-001255555	d3b94ae9-279e-43c1-81d7-67d6960734a9	30cac1dc-f6ca-4f56-b811-50a78685b5cc	b7268580-2df6-4e42-a1ac-92d82c042d1e	d3ed83fe-1a92-4e9a-b99d-a1bb77b9a6ef	25b76889-9131-4e1d-8212-8b40ebda5f21	3	\N	\N	2026-11-09 06:29:23.810229	\N	\N	\N	\N	\N	\N	EN_ATTENTE	\N	2026-11-09 06:29:23.810229	2026-11-09 06:29:23.810229	\N	\N	\N	\N	000008
\.


--
-- TOC entry 3661 (class 0 OID 16891)
-- Dependencies: 236
-- Data for Name: fiche_impression; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fiche_impression (id, fiche_id, imprimeur_id, date_impression, numero_exemplaire, motif_reimpression, created_at) FROM stdin;
\.


--
-- TOC entry 3655 (class 0 OID 16750)
-- Dependencies: 230
-- Data for Name: fiche_passager; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fiche_passager (fiche_id, passager_id, numero_place, created_at, tarif, observations) FROM stdin;
bd1dd13a-8f2a-4265-8937-a0f659d6b7ee	3dd3c58e-0560-4e1b-bb7e-f44395aaf857	3	2026-11-01 13:48:05.243992	500.00	bien portant
bd1dd13a-8f2a-4265-8937-a0f659d6b7ee	686fb640-ae19-4490-8cdd-d851191db268	8	2026-11-01 14:09:36.182788	700.00	BCP DE BAGAGES
bd1dd13a-8f2a-4265-8937-a0f659d6b7ee	3edc3a77-adf0-4ed7-bdf1-4ab5cfd8b14a	8	2026-11-01 15:17:23.69953	5000.00	ras
bd1dd13a-8f2a-4265-8937-a0f659d6b7ee	d56b3f4f-9d3a-44a2-a5eb-5d7e7681aca7	3	2026-11-01 18:34:17.558635	500.00	bien portant
bd1dd13a-8f2a-4265-8937-a0f659d6b7ee	48a75795-7c2b-4e2f-b2f0-9598ef108dfd	7	2026-11-01 18:38:42.24023	1000.00	bien portant
bd1dd13a-8f2a-4265-8937-a0f659d6b7ee	c634f8d9-205a-4c3b-9326-b5b33ca044d1	6	2026-11-01 18:40:43.266025	1000.00	bien portante
bd1dd13a-8f2a-4265-8937-a0f659d6b7ee	74709a52-d0d3-4500-b33d-d8669b4e55e7	5	2026-11-08 20:35:26.761597	850.00	\N
\.


--
-- TOC entry 3662 (class 0 OID 16913)
-- Dependencies: 237
-- Data for Name: fiche_remise; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fiche_remise (id, fiche_id, remise_par_id, date_remise, observation, created_at) FROM stdin;
\.


--
-- TOC entry 3645 (class 0 OID 16495)
-- Dependencies: 220
-- Data for Name: gare; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gare (id, code, nom, ville, adresse, statut, created_at, updated_at, latitude, longitude) FROM stdin;
b85b7387-decd-4626-abac-80e70d08bbda	GARE001	Gare Centrale	Mboumyebel	Carrefour	ACTIF	2026-09-14 05:07:17.067087	2026-09-14 05:16:34.694691	3.848	11.502
f4b143b4-fa68-41ea-9d6e-7022d3a1b6f6	GARE0001	Tetem	Eseka	face cimetiere	ACTIF	2026-09-29 07:39:33.673416	2026-09-29 07:39:33.673416	7	15
d3b94ae9-279e-43c1-81d7-67d6960734a9	GARE-Eseka	Gare routiere	Eseka	carrefour marche	ACTIF	2026-09-11 14:04:45.459057	2026-11-09 04:57:10.200368	\N	\N
\.


--
-- TOC entry 3651 (class 0 OID 16568)
-- Dependencies: 226
-- Data for Name: itineraire; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.itineraire (id, destination_id, code, libelle, description, statut, created_at, updated_at) FROM stdin;
25b76889-9131-4e1d-8212-8b40ebda5f21	d3ed83fe-1a92-4e9a-b99d-a1bb77b9a6ef	ITIN-001	ESEKA-Boumyebel		ACTIF	2026-11-08 18:22:47.267937	2026-11-08 18:22:47.267937
\.


--
-- TOC entry 3652 (class 0 OID 16585)
-- Dependencies: 227
-- Data for Name: passager; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.passager (id, nom, prenom, numero_cni, created_at, updated_at, telephone) FROM stdin;
3dd3c58e-0560-4e1b-bb7e-f44395aaf857	biloloo ngue	samuel	CNI00012555	2026-11-01 13:48:05.197202	2026-11-01 13:48:05.197202	14389248545
686fb640-ae19-4490-8cdd-d851191db268	BILOLOO	ALPHEE	CNI0025698888	2026-11-01 14:09:36.160887	2026-11-01 14:09:36.160887	4389256355
3edc3a77-adf0-4ed7-bdf1-4ab5cfd8b14a	Madea	ndumba	CNI2258444	2026-11-01 15:17:23.660594	2026-11-01 15:17:23.660594	9874441255
d56b3f4f-9d3a-44a2-a5eb-5d7e7681aca7	BILOLOO	LYAM	CNI-2558888	2026-11-01 18:34:17.527331	2026-11-01 18:34:17.527331	438965721
48a75795-7c2b-4e2f-b2f0-9598ef108dfd	BILOLOO	OWEN	CNI0001255888	2026-11-01 18:38:42.21505	2026-11-01 18:38:42.21505	43893562858
c634f8d9-205a-4c3b-9326-b5b33ca044d1	BILOLOO	ASRAELLE	CNI0248888	2026-11-01 18:40:43.238178	2026-11-01 18:40:43.238178	4968752294
74709a52-d0d3-4500-b33d-d8669b4e55e7	Ngue	paulini	11458888	2026-11-08 20:35:26.728366	2026-11-08 20:35:26.728366	6982451111
\.


--
-- TOC entry 3660 (class 0 OID 16838)
-- Dependencies: 235
-- Data for Name: proprietaire; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.proprietaire (id, nom, prenom, telephone, adresse, numero_piece_identite, type_piece_identite, statut, created_at, updated_at) FROM stdin;
bfb47b50-6000-42c8-8220-8985ae27f12f	Kameni	Jean	699123456	Yaoundé, Cameroun	123456789	CNI	ACTIF	2026-09-25 05:02:55.115515	2026-09-25 05:02:55.115515
77ccafa1-b405-4ced-9094-7a276a45ae43	BILOLOO	ALPHEE	4389243698	rue Oliva-Noel, 1318	CNI0001255555	CNI	ACTIF	2026-11-01 19:40:59.299396	2026-11-01 19:40:59.299396
\.


--
-- TOC entry 3659 (class 0 OID 16818)
-- Dependencies: 234
-- Data for Name: refresh_token; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_token (id, user_id, token_hash, expires_at, revoked_at, replaced_by_token_id, user_agent, ip_address, created_at, session_id) FROM stdin;
266	3	2cf0fe94d1b9814ca0b05f79e8dff6f438f4e05865308e0045ca0de5692f5cc6	2026-10-25 12:27:26.271	2026-10-21 05:16:29.605	267	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-18 12:27:26.274085	\N
267	3	9eca9e9ebdbe70e4c35a2b12bb9fa0d78f40f58af40016ad7b8979efffd11475	2026-10-28 05:16:29.58	2026-10-21 05:16:32.527	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-21 05:16:29.582681	\N
268	3	c3724c48347459a36cd3eb4185c2f4efe49ef69ac1f70e73afab6fe1007cb5c8	2026-10-28 05:16:34.226	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-21 05:16:34.224776	\N
269	3	166c7643845d0b3622be2fb8cb0ae0cec01fe9ca0d629230c1479ff38e75bbe0	2026-10-28 05:18:02.398	2026-10-21 05:27:40.232	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-21 05:18:02.39995	\N
270	4	c3a09e2b0283215e8ec38731ebb9dc706b173ee9989f23726efb007284173002	2026-10-28 05:28:06.47	2026-10-21 17:58:43.385	271	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-21 05:28:06.470974	\N
271	4	d261c0779bb19c0cf27c7fdc4543b96d41c7a88c034963cfb070cd592c614913	2026-10-28 17:58:43.175	2026-10-22 05:29:09.888	272	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-21 17:58:43.210572	\N
273	4	7f13055d4d40cd673dd9f993e7bf98f2ca6fa896e3e011f96c72762accdd5572	2026-10-29 12:14:35.637	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-22 12:14:35.639766	\N
272	4	1dc5c0370415b94d696d98b0f593ea9a974e8d72faa802930a77cd56ebc23bcb	2026-10-29 05:29:09.868	2026-10-22 12:14:35.668	273	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36	127.0.0.1	2026-10-22 05:29:09.871001	\N
274	3	e3f604ce48ccc964434a36b4c2370a3b7a667cb8ca4a7fb4c7fa1dd09cf9716b	2026-10-30 08:29:09.504	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 08:29:09.508506	\N
275	3	c9b7ce6002b8bf5744c3a8cc482d1547dfb580fea046e1c2295a0fd51fac532c	2026-10-30 08:39:31.65	2026-10-23 08:42:32.088	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 08:39:31.651047	\N
276	4	b5d23e0d6b9477619f35df3b79d14e25cef3ebbaeb1f5e7d1175a77ae148589d	2026-10-30 08:43:15.419	2026-10-23 11:00:38.367	277	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 08:43:15.421809	\N
277	4	1bdeb7f586ff7ed402ebd3ec752c58806980bc74c4ac52043b0958c53eb49c95	2026-10-30 11:00:38.353	2026-10-23 11:01:13.87	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 11:00:38.356975	\N
278	4	e72d44c5ad14e012fef7475cef08e5ca2528452e2d4b0bb856cc9fcee8841ca2	2026-10-30 11:01:23.22	2026-10-23 11:05:06.266	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 11:01:23.221104	\N
279	4	26c916db51f108c13fca006786ab5b677a6dde37bb9542421bbcbef0960f03f7	2026-10-30 11:05:09.908	2026-10-23 11:05:18.67	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 11:05:09.908725	\N
280	3	9def29620b6714075477aec761ce31a0c63f3637c0399ac89126e12424df2d82	2026-10-30 11:05:22.044	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 11:05:22.044825	\N
281	4	39a35e61fd3ec6b496c209b71f82520310d1e8c0c9283fe6769bb69a1b113baa	2026-10-30 11:06:35.04	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 11:06:35.041989	\N
282	4	5a2bba134982e3eddd535fb5ccea943f1ab2debfa2a7770821c95694969e7545	2026-10-30 11:08:31.768	2026-10-23 11:09:17.811	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 11:08:31.77295	\N
283	4	e701426b92271d17100a452ecfb2311259a3d984251b0ab04156cd763c08e597	2026-10-30 11:09:30.789	2026-10-23 11:31:35.855	284	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 11:09:30.789949	\N
284	4	f2b84453b234855f7c34391225d0ae2b2540b94359966e2aecc1ee6816e36d4f	2026-10-30 11:31:35.85	2026-10-23 12:19:23.038	285	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 11:31:35.851352	\N
285	4	2de6ed2ac2d17fd3bfa4a601a21efa2854ac39832a6d5e7e5b112f4d7d2df9ab	2026-10-30 12:19:23.014	2026-10-23 12:21:22.749	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 12:19:23.017766	\N
286	4	5f502d7b715389d2641ed49d22b4d8946ad517a2b66c8ca179bed90a91031953	2026-10-30 12:21:24.734	2026-10-23 12:21:44.155	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 12:21:24.735844	\N
287	3	85af8bb62b855cb635ab089e5d245c2b240cc7e7b933ea97cf520f0bd655cb72	2026-10-30 12:21:48.15	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-23 12:21:48.151916	\N
288	4	f3a1e1a2522c89892a829b6b96390371472bd4ee918c8d74140f465594cd3cf0	2026-11-01 21:28:57.629	2026-10-25 21:35:59.637	289	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-25 21:28:57.632926	\N
289	4	105d8ba2a067e0eab581289d4e3d5b67bbd6b50ef5e3d2d58ccecaad2f58a435	2026-11-01 21:35:59.631	2026-10-25 21:36:26.196	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-25 21:35:59.632541	\N
290	4	59b6ae41f458d340cc2c3e08bf0465bf7f17e97f19d9bf1b1eae4a11830e6967	2026-11-01 21:36:37.39	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-25 21:36:37.391182	\N
292	3	5760f37e2b6ff36ac57853220206163b372cc3ce96b183d02c4cf0251ba678e4	2026-11-07 20:41:57.232	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-31 20:41:57.235562	\N
293	3	2c6c911fba5bdc9e8d2604576566a14468ae7d0610b414dfc2706ee53ff72ef3	2026-11-07 20:48:47.415	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-31 20:48:47.418033	\N
291	3	4eb746144215c6db1daec9a6c2fa816de4de73d7846118cd0027b5656eef9b2f	2026-11-07 19:03:11.82	2026-11-01 05:58:29.759	299	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-10-31 19:03:11.824071	\N
294	3	d2298606682c042ae6176e9f9a7ce7cbc81abd0d73875aee464064d54dbcc896	2026-11-07 20:54:38.513	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-31 20:54:38.514815	\N
295	3	2600b62e85a983419eead15615768849d71b5307ba7dcd7e4171b86e716a2259	2026-11-07 21:12:47.708	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-31 21:12:47.711072	\N
296	3	da8f1ea690c20d0cc22a5f63c8458820513e00b96d6e6b4631eb40a2540162a4	2026-11-07 22:02:59.59	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-31 22:02:59.594057	\N
297	3	f45ca47c2d3fd17ebebd91989dcef31f7c5a7ffada26c2b9be276967330c7aff	2026-11-07 22:16:03.373	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-31 22:16:03.377355	\N
299	3	6d5ebf93a528714b341fd76f8170c3fa74761de0e2bb228532e153e5091c08f1	2026-11-08 05:58:29.735	2026-11-01 05:58:40.498	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-01 05:58:29.740548	\N
300	4	8ba7dcb7ff0887b21c8aa7e5ad28303135caa61a180a7f5877df89e31020b08f	2026-11-08 05:58:58.658	2026-11-01 05:59:41.851	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-01 05:58:58.660055	\N
298	3	786caae33a22701cb6b2c347b5f1242fdb29de8c38065b5a19c5a5008bf9803c	2026-11-07 22:54:05.548	2026-11-01 06:35:31.267	302	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-10-31 22:54:05.551936	\N
302	3	14aab1f15456eb2bbd68764ca9224605c6f26380d0ba92553c0d3235c3ee1532	2026-11-08 06:35:31.262	2026-11-01 06:35:38.18	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 06:35:31.265219	\N
303	3	ff85623b1030fe1265c8f668e51c5ae16e134fa7a5591474a506394386ca704d	2026-11-08 06:35:50.788	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 06:35:50.791159	\N
304	3	3d62d88366e08108926249a387b913612d320b63e19f41b4fc0b0607db3003af	2026-11-08 06:51:19.397	2026-11-01 08:19:19.919	305	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 06:51:19.401222	\N
305	3	4e69a154a31aa8e2161c0fb05a3a7b37f610a0edb735978286243eda2dbc2bcd	2026-11-08 08:19:19.9	2026-11-01 08:41:15.12	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 08:19:19.9021	\N
306	3	ab71bda13d6ec9b668419822a84d694618c18439390784b280dd956541f87486	2026-11-08 08:43:09.707	2026-11-01 10:24:43.923	307	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 08:43:09.708958	\N
307	3	c1f65e292ba4aeec2105d6dbfdbe17ed717f19f319d2f35dc4b958f4129f3ba7	2026-11-08 10:24:43.905	2026-11-01 10:26:49.904	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 10:24:43.90722	\N
308	3	5560c26b66625956359d0468586d732d6f49e558a064d1bf664e792c7d50286b	2026-11-08 10:26:51.422	2026-11-01 10:31:01.006	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 10:26:51.423454	\N
309	3	d778bceacfd1edb54e8891ecd96d52b62ff467402805b5bff4d19e58de2bf5fb	2026-11-08 10:31:02.609	2026-11-01 10:39:23.51	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 10:31:02.610628	\N
310	3	23092f47a917191b5255fb2ccb23592c693f6a0408f4c72dfb175561728d7481	2026-11-08 10:39:24.909	2026-11-01 11:00:25.785	311	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 10:39:24.910271	\N
311	3	3defcba7f8dda92799a22ff4da45c62ecc6d04f37f6dfb233d3fccac5c56841c	2026-11-08 11:00:25.746	2026-11-01 11:05:36.248	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 11:00:25.751241	\N
312	3	e8f78800eaa9a0ae2ba6831f034fa57be37897af41a4f8adca755dd8127dbd74	2026-11-08 11:05:37.832	2026-11-01 11:22:13.966	313	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 11:05:37.837	\N
313	3	b5279c185950311fd14791bb525fdc7657f3e7354949eca8f0769396d6a6c629	2026-11-08 11:22:13.951	2026-11-01 12:15:32.283	314	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 11:22:13.955897	\N
314	3	15deaa5e56449555b81f9f8f7879f7e09a6058727b3979397c458c17c6602c4e	2026-11-08 12:15:32.264	2026-11-01 13:06:16.028	315	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 12:15:32.267117	\N
315	3	2ad11c74b02bbfe8bce13851fb9ea7065bedbda50dc4701052c82c6cd3900026	2026-11-08 13:06:16.02	2026-11-01 13:18:57.471	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 13:06:16.023076	\N
316	3	1498de6a8f815a0ef8262c87435a61cb9e953ea01eceaf8808e8912b8ca8121b	2026-11-08 13:18:58.655	2026-11-01 13:42:29.301	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 13:18:58.656208	\N
317	3	1a6d4d73e159ee3353097372b461d1b2fe900357858b2139b149fea596ec136a	2026-11-08 13:42:30.564	2026-11-01 14:09:36.139	318	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 13:42:30.566281	\N
318	3	0db353cab9957a554257d2f5873e5f8db7e8d61dbc19358b6e8a5aa2f0bcecfd	2026-11-08 14:09:36.124	2026-11-01 14:12:56.343	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 14:09:36.125587	\N
319	4	32c69b50a63410416d5ae6f7a68f3020b1a065f34987d092e1a88a26b323b4a2	2026-11-08 14:13:01.686	2026-11-01 14:32:53.361	320	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 14:13:01.687009	\N
320	4	b95c7ba14ac6957d7eff66e46abdc3a748e7726019f6da8b27a88b7448e90e8e	2026-11-08 14:32:53.121	2026-11-01 14:32:58.491	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 14:32:53.153088	\N
321	4	c3ae8957cf7af5c28b40c7611634a85775807e9b05dda84ceeb1b9b87fee52d0	2026-11-08 14:33:00.384	2026-11-01 14:33:18.629	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 14:33:00.385361	\N
322	3	6179a3cc0e88e6bb08716cdb344478158d50a81bec4dc15bb8b32644ca1952d9	2026-11-08 14:33:22.265	2026-11-01 14:33:45.113	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 14:33:22.266245	\N
301	3	83fcedac286c2293af188df8012cc15e8aeb2b98220cfd78429a03d381b7475b	2026-11-08 06:33:28.751	2026-11-01 16:10:58.274	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-01 06:33:28.753044	\N
323	4	4e926a385229b62863057980427601baf4be69c0a47bccd1976a31ea6ef27fd3	2026-11-08 14:33:50.243	2026-11-01 14:35:17.486	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 14:33:50.244313	\N
324	3	31e3da0291bd67a9654cb454d2e91e631d68104a704a8cd78ba19e10df6ace71	2026-11-08 14:35:21.558	2026-11-01 14:50:43.708	325	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 14:35:21.559052	\N
325	3	53f1f7308b7a8508ab5d0bb7c607adbc8c3281acb60753f8e54e1743650ca234	2026-11-08 14:50:43.693	2026-11-01 15:08:21.891	326	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 14:50:43.695341	\N
326	3	df41552fb68cfb0a191294d13495065e7d0de0bc7e4898e0e2c2b714f7bfe0c6	2026-11-08 15:08:21.865	2026-11-01 15:30:10.835	327	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 15:08:21.869704	\N
327	3	0cc400eea115c20296236de100bd4ba6c2e67d31f0c8674ccfa1dfd146fd43b7	2026-11-08 15:30:10.825	2026-11-01 15:49:27.628	328	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 15:30:10.82887	\N
329	3	ac4d3f238a959729f947e9a28a4baa264bcb043ac0b0f4a0f8487807ed0cc7a4	2026-11-08 16:11:17.396	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-01 16:11:17.399187	\N
328	3	dc8a4826160e82ce3bc377c5cb1f11539c51d751d8ac08ef411ff59c7ab224b9	2026-11-08 15:49:27.61	2026-11-01 16:12:13.324	330	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 15:49:27.611961	\N
330	3	1695f494cc4d37d91b19793a190a7af908994da504e6590adc1dcb47e3d40358	2026-11-08 16:12:13.299	2026-11-01 16:27:25.46	331	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 16:12:13.30836	\N
331	3	e989ee73c9ffc6fcd0f24777469415a95730985f4cb2507f2a46a3cffc464409	2026-11-08 16:27:25.455	2026-11-01 16:42:29.871	332	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 16:27:25.456879	\N
332	3	78e4b0d51e4e11751c4765f48bb2078f254c421778e6661a03e25b672a0b9790	2026-11-08 16:42:29.865	2026-11-01 16:59:44.177	333	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 16:42:29.867259	\N
333	3	7f803fe358526e6e0eb954525a6175dfbd390bdd9ebc2283e68683a0544a2a66	2026-11-08 16:59:44.171	2026-11-01 17:12:23.046	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 16:59:44.172944	\N
334	3	c9449acb01411b6e7c401c341ceb1d4f6f067c305be925e05ec9f27a6f09a55c	2026-11-08 17:12:24.566	2026-11-01 17:35:02.442	335	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 17:12:24.568758	\N
335	3	921385be393f92d83f6235de2419a1700cbf4338cfd17a6c5dfabbe9392461af	2026-11-08 17:35:02.435	2026-11-01 17:49:36.156	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 17:35:02.436072	\N
336	3	ecd8383371a5dc4f6e4b694ba04812f8776e58a4f7336480ecdb00175a7d4562	2026-11-08 17:49:37.573	2026-11-01 18:05:17.71	337	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 17:49:37.575223	\N
337	3	7c8c0b07db1d4a3d1a89f5d9c5f7e40b6715d7571c77b6655c82688b50d6f1c5	2026-11-08 18:05:17.703	2026-11-01 18:33:04.204	338	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 18:05:17.705207	\N
338	3	08f65a22c673a006f237ee30428b1fab3fe9ee0a6288bbc4a9c92f012ee0eee1	2026-11-08 18:33:04.188	2026-11-01 18:35:38.686	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 18:33:04.191156	\N
339	2	3e02d5699734c4d6884f33ba07a1503f03e51865870f7475da549071bbadfa75	2026-11-08 18:35:46.087	2026-11-01 18:37:08.686	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 18:35:46.088976	\N
340	4	5fc6d7c493d0c443db14843b339d8ac51ab10293769ff9c71ebaa231c8009b43	2026-11-08 18:37:23.617	2026-11-01 18:37:43.88	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 18:37:23.619118	\N
341	3	74a2fa3f710bba8701da639a3fadc8f37e109064d21c9c70907a3c6a32812698	2026-11-08 18:37:47.581	2026-11-01 19:00:21.396	342	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 18:37:47.583806	\N
342	3	e98638fd032251778af8b4b4e5ba69fcb31ad21a1d0b42aa20284b99e0d95e05	2026-11-08 19:00:21.374	2026-11-01 19:22:03.023	343	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 19:00:21.378313	\N
343	3	7a0339dac28a0dc738ac7aebff01ffdce5ce461733f1e8cc61646364315b8d10	2026-11-08 19:22:03.013	2026-11-01 19:39:16.99	344	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 19:22:03.014792	\N
344	3	8905696d17f117f566242b4c71eab9687c42bd4f71ba6b787952b14b943f8dd1	2026-11-08 19:39:16.985	2026-11-01 20:02:16.323	345	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 19:39:16.987364	\N
345	3	d4383804110a2a3b9f738452de2bac9bfbf0c5358d7837323a4565f4bcbdd326	2026-11-08 20:02:16.308	2026-11-01 20:29:13.2	346	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 20:02:16.314476	\N
346	3	7afbcfacabdb40e8ed5afbee2b3a8371baabe18a810ad100a121190230a17bea	2026-11-08 20:29:13.185	2026-11-01 21:03:39.029	347	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 20:29:13.187684	\N
347	3	a66fa6a5e86d9f814f4c9e04f46c87c87be9d768d36d3d31f521849cb2258653	2026-11-08 21:03:39.013	2026-11-01 21:21:01.722	348	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 21:03:39.014045	\N
348	3	773753502e96e9af80fbff3e982d58c2bb1a747ea18d398bcbe3e222623cc3b8	2026-11-08 21:21:01.712	2026-11-02 06:49:38.405	349	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-01 21:21:01.71599	\N
349	3	d8018a6632a0bfbc4d75b64120583ffb0188b13c0ee615b7fc412c602ff31075	2026-11-09 06:49:38.263	2026-11-02 06:53:17.17	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-02 06:49:38.264748	\N
350	3	283fb3ae39e6f68f1533867e06068535e0fa593b06cad1ad69a09df95038b97a	2026-11-09 06:54:58.476	2026-11-03 17:59:51.211	351	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-02 06:54:58.477533	\N
351	3	40b7ab006528616356a3ecf69fc853b2542a1adf9cc7f16018094ceba24616c8	2026-11-10 17:59:51.185	2026-11-03 17:59:53.275	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-03 17:59:51.18787	\N
352	3	48d065268165e97b8422497981736f60733bfcde6711d1203945247cb244f4ec	2026-11-10 17:59:54.754	2026-11-06 02:32:29.655	353	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-03 17:59:54.755543	\N
353	3	0e62405fa6ea7b7d4e9bce2b7297a9f023c093b40162b0b1c196aaadc11200d4	2026-11-13 02:32:29.636	2026-11-06 02:32:31.226	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 02:32:29.638825	\N
354	3	76ca98d8babf29aaf42dfaeb5e0ff329a0108fef0918d1ad0aea2187580a678c	2026-11-13 02:32:32.927	2026-11-06 02:34:28.25	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 02:32:32.92902	\N
355	2	4210701a95fee870effbab85cea7e2644c75a77b205cdda3e6eb36e07175307a	2026-11-13 02:34:37.492	2026-11-06 07:38:54.521	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 02:34:37.493771	\N
356	2	46a629f08180be2518ccb4b5fea32e4e7074baa209ee5e3046714fb3c1170ee0	2026-11-13 08:50:17.791	2026-11-06 08:50:23.179	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 08:50:17.792436	\N
357	3	c8d8eb9a21dba7f7956cb26296ff097dabb1ee565093413a99c4afaeafd731ff	2026-11-13 08:50:26.413	2026-11-06 09:06:29.321	358	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 08:50:26.424878	\N
358	3	5c840eeca4e18ce6c76929437b400c538069c65da3edf3bce6f4faf1e46fa06a	2026-11-13 09:06:29.315	2026-11-06 09:21:49.586	359	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 09:06:29.31615	\N
360	3	38baa0748ab555435c1afffab014b2c253302b0c732b0cf5949fc9617521a09d	2026-11-13 17:22:37.469	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 17:22:37.471461	\N
359	3	aa5cb6a8a1a97be846beceb972624a3a72d893872123137e8803934963e175f5	2026-11-13 09:21:49.58	2026-11-06 17:22:37.943	360	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 09:21:49.582031	\N
361	3	f3f91981f5710a901db2d938670e16cfebdaff6874d5a4c6fece620fc1c2fad5	2026-11-13 17:22:41.718	2026-11-06 17:36:13.608	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 17:22:41.870412	\N
362	3	52ccd45fe684014444b68b2f5c731d3ea24787509ecd01f92080e34bcc9a2870	2026-11-13 17:36:15.281	2026-11-06 18:39:23.041	363	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 17:36:15.283096	\N
363	3	8dffadd5055509b64f7a0b632be32adeea692ceaf2dd3e86690c37f5171b20ae	2026-11-13 18:39:23.024	2026-11-06 18:39:27.357	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 18:39:23.026869	\N
364	3	5a1481074d90319c64c6146b2ea85bfad9488896bcc7874ba287971f71e9f611	2026-11-13 18:39:28.703	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 18:39:28.703801	\N
365	3	1bc6fd870070e1c689ee1b63e740fef4b1ea7a2190ddb0e874bd81edfa9b4b6b	2026-11-13 19:19:32.747	2026-11-06 19:23:40.755	366	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 19:19:32.772308	37c68923-776e-4bc9-87b6-849f24409c3a
366	3	198306e3f0caaadefb0d1f79c263bbc904ac7eb8f50261433df26ee98d695610	2026-11-13 19:23:40.719	2026-11-06 19:30:24.673	367	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 19:23:40.751204	37c68923-776e-4bc9-87b6-849f24409c3a
367	3	a0c218c1f788b72149cbdec2c5f5111d2e779d0a855bd0728bc136343eab59ed	2026-11-13 19:30:24.631	2026-11-06 19:35:21.822	368	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 19:30:24.665915	37c68923-776e-4bc9-87b6-849f24409c3a
368	3	a17b4622a1c2f052e296b301e682b085b37184e6398b3c07456f59fecec59b7e	2026-11-13 19:35:21.806	2026-11-06 19:45:55.37	369	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 19:35:21.819609	37c68923-776e-4bc9-87b6-849f24409c3a
369	3	8196e5ba29e7a8caccfff5cd5c838bb26f9f5407b260f59963c337cb63ac6daa	2026-11-13 19:45:55.343	2026-11-06 19:47:18.533	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 19:45:55.367382	37c68923-776e-4bc9-87b6-849f24409c3a
370	3	cc5425779a2238eda2682de2afe0ffe07703a440b35a8b0faed2e13abfaf756c	2026-11-13 19:47:19.785	2026-11-06 20:04:49.478	371	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 19:47:19.804044	b7fac4d8-1714-47f0-a84f-4bc18d847e71
372	4	e02b9bcb1b4efdce8038ac7b6dc713dcb2f8d4f187c5d655574bb2e1fa03f517	2026-11-13 20:08:45.384	2026-11-06 20:09:07.518	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-06 20:08:45.389528	85fa98e4-5cd1-46db-8f4e-3a3251a8e863
371	3	e853b9ef4f4e736c614c62a3e8ee4dc90b085b4b0bb9038f69a0d1e6ce5708ea	2026-11-13 20:04:49.456	2026-11-06 20:20:04.164	373	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 20:04:49.478284	b7fac4d8-1714-47f0-a84f-4bc18d847e71
373	3	75830ab6570b2d42f387a8fa5e011f96c144611dea372cd4600374528158f886	2026-11-13 20:20:04.126	2026-11-06 20:35:04.117	374	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 20:20:04.148983	b7fac4d8-1714-47f0-a84f-4bc18d847e71
374	3	9775d81bda5e92f9476b5ae9ccf7bcd296ee8456a3bfc2c1adfe4722dcfe081d	2026-11-13 20:35:04.105	2026-11-06 20:46:03.97	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 20:35:04.114629	b7fac4d8-1714-47f0-a84f-4bc18d847e71
375	3	bdf088f7cd17c07d53ebb6840fd818a86e148697f8fc05dae151485c65ac8ad2	2026-11-13 20:46:06.125	2026-11-06 21:02:04.127	376	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 20:46:06.140692	a196c5db-c709-4ccb-a9a1-0270f1fc6751
376	3	364d0cb10d212dd2bef2a064f5f79000ac52f902c28dc0c73df6b261af19fee8	2026-11-13 21:02:04.115	2026-11-06 21:17:05.108	377	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 21:02:04.130118	a196c5db-c709-4ccb-a9a1-0270f1fc6751
377	3	1fb411602b87c2c7ca83fe5f30ecb4685e1f283ebd5746e25673faeba0128f63	2026-11-13 21:17:05.084	2026-11-06 21:33:04.116	378	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 21:17:05.104106	a196c5db-c709-4ccb-a9a1-0270f1fc6751
378	3	1cd26e53ab6a386883c252b61736628d5d823e623a30a5711a374e857c62a5eb	2026-11-13 21:33:04.101	2026-11-06 21:48:04.102	379	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 21:33:04.113839	a196c5db-c709-4ccb-a9a1-0270f1fc6751
379	3	d090aea6b612ba1c347324e55d5d507192beff30675bf18a73245369ce2bef92	2026-11-13 21:48:04.095	2026-11-06 22:15:35.253	380	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 21:48:04.105995	a196c5db-c709-4ccb-a9a1-0270f1fc6751
380	3	51c77b3db656ec7b19ca7b4479b8e6d3179cbe5c086994c795e788c5f363aac8	2026-11-13 22:15:35.242	2026-11-06 22:15:37.562	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:15:35.251473	a196c5db-c709-4ccb-a9a1-0270f1fc6751
381	3	2da40af6e87ef173d2105daa7057dcf8833e86f51bbff11bbd924b9949b9223f	2026-11-13 22:15:40.626	2026-11-06 22:15:46.76	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:15:40.641929	d094706f-8967-4966-9b2d-ecd0f234c3d7
382	3	f77cf1c28fcfe22912e59729736c91a0a318ae10abb042d1040ecb90aeba57ac	2026-11-13 22:15:50.791	2026-11-06 22:16:19.915	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:15:50.797002	e6ce1c69-61c4-4b98-b34c-e27977bcde8d
383	3	5e889c0db0a3cdc5b0a28776c89fa049548779ddca5a31bb419557bfc23a7c5f	2026-11-13 22:19:13.145	2026-11-06 22:19:41.845	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:19:13.164209	582a6567-6da3-4e63-b334-6b9d96e2d329
384	3	ac6ed6ab8dac351870618de2a7bf7ac916ac1a9228caa8b8bd5bbeb39b5c1793	2026-11-13 22:23:03.33	2026-11-06 22:31:16.134	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:23:03.348167	e33c102e-46a8-4660-b7a1-300faf5923ff
385	3	523e391ea2505e6c0dcf7e41d5cd359e9439a51df1c0086984d2f28d3cd86eb9	2026-11-13 22:31:33.473	2026-11-06 22:34:42.326	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:31:33.491911	7733324b-c86d-448f-ad67-5f9009cbf443
386	3	6fa3c43597cee2bdad9a5847d02061e7629c6341fd2010ef0a45b6274abe580e	2026-11-13 22:34:47.671	2026-11-06 22:39:28.04	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:34:47.683587	79527953-3577-49e1-b882-b55b9751b77d
388	3	742f43710680c9b567515a4e09add79b28fa7ae37a73e0e1430dcd552919fd31	2026-11-13 22:39:32.131	2026-11-06 22:40:10.288	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:39:32.144811	2207c701-49e0-49ee-b875-b9fcf3573fb7
389	3	7e7c6df38895206ca2bbbdbe4a0c346045b8e09788ff06d74dbd761294c1933d	2026-11-13 22:40:13.415	2026-11-06 22:40:32.321	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:40:13.419926	c1e50693-51fd-437e-b6c5-6f18d250d9dd
390	3	5acf9291d6a4539e26607eea19fb6fcc5fa2997bfd4231f179aa958f79409d6d	2026-11-13 22:40:36.42	2026-11-06 22:40:51.755	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:40:36.442692	2f827dec-737d-44fd-bc9c-edceb6aac821
391	3	0752012fdb5efb7e38fffb0bb8aa8463684e32531a7460ecdcc3130d5fff4d16	2026-11-13 22:41:18.182	2026-11-06 22:42:57.903	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:41:18.200605	076a8364-d061-437f-9426-a042e2b331ae
392	3	45d8c5ead298d09dbd11d1eb58b5310a3145077edbb876b9ee2959ca6af10960	2026-11-13 22:43:00.841	2026-11-06 22:45:20.524	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:43:00.847978	03e350ea-e01f-4888-9f8f-9842947438d4
393	3	db4cde42522053456ff715b15ac99d0b401805fa10381e11e5feaa4c3887a65a	2026-11-13 22:45:22.598	2026-11-06 22:45:43.525	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:45:22.624021	1f173a25-7c99-42cf-9197-1a3c15d72b55
394	3	5674370864e4f94590fea08aa159901bb281cf1d18ae7de54d45fc92c23f9dea	2026-11-13 22:45:45.745	2026-11-06 22:45:58.116	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:45:45.753505	322a88ab-2bf1-42a0-9368-1689e16cf638
395	3	e1654b14ba17d3645bb8b2a223c94ad031aa89e97586531b54206141eef43486	2026-11-13 22:46:07.695	2026-11-06 22:46:11.491	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:46:07.715915	b25f9199-035f-49fe-9c84-28c23f11aeaf
396	3	66d639686d238e23abdecd7e0ee40e1d6dc52161a3f8e778ae0c1671aab54a90	2026-11-13 22:46:16.207	2026-11-06 22:46:20.202	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:46:16.224505	27bfddfd-aeea-43cc-b9a7-c86602820be2
397	3	d0aa1dfe0847347f317b79cb7756a3bbf6f373e468d6755e92470e56fe5c9d6d	2026-11-13 22:48:39.058	2026-11-06 22:48:44.592	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:48:39.077953	9cd92359-be4f-43d8-8da6-b8fa05213fd8
398	3	c0b59c611c1111905b4ad76c7e501b80e7d7f32ec31e2761622901ccfee64a1b	2026-11-13 22:48:48.655	2026-11-06 22:49:04.685	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:48:48.672786	2139f34a-f089-4b0b-8b2f-ccbee27ea893
399	3	eed90ddbd2e7d1ca7f326631c1d3d6c3d9ae39f62d644caacf14bb543c8ab9ef	2026-11-13 22:49:29.082	2026-11-06 22:54:59.06	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:49:29.106265	9971ecf8-1e57-4715-a45d-0a4e5f2d1b8c
400	3	7caa6609a72e808a74b5550987108bb39f137416cc3bb7d30c126111211dca3a	2026-11-13 22:55:08.199	2026-11-06 22:55:31.727	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:55:08.227118	c4733f17-58a3-437e-815e-a1b4d775fbbf
401	3	4c4bb723ce7bf8261d0179f06578ce1384d0155020d5230a0b4fbb97f20abd6c	2026-11-13 22:55:38.791	2026-11-06 22:58:20.48	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:55:38.813088	98f9de67-3560-4fcb-b7b6-8a00d30de6c8
402	3	d0d08389e443b74ac87d9dea3e02780f38e812fc6acb8784115ae0ce6a5af5d7	2026-11-13 22:59:29.878	2026-11-06 23:07:01.224	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 22:59:29.898685	7976785b-6622-4a89-aaf7-bccc85bff26d
403	3	ac16ec0926154ae63c0e45b440b52cbf07bbdfbd9bb91a4f6004e3999af6c88d	2026-11-13 23:16:32.167	2026-11-06 23:19:47.96	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 23:16:32.185533	c2ac5e6a-022a-4aaf-8c47-64b8668f4ce4
404	3	2df633339038f90437a1672cf1f1c6ffb725f608303ba58d9307b31270e62252	2026-11-13 23:20:51.425	2026-11-06 23:23:00.259	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 23:20:51.444799	00b6412f-c4a8-4186-a237-602c94d73db6
405	3	bf947083cb5da71dd3a61c5009b269323b93e58bda4291b416a132e7c2766b16	2026-11-13 23:24:12.274	2026-11-06 23:24:16.509	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 23:24:12.292513	31009ea0-14e6-42fc-b08a-05f92a15fca2
406	3	2c58651fdc18224fe6bd27eb501f87d7a7a210c2e6a2424af6bfed9b0d6e9adf	2026-11-13 23:24:33.702	2026-11-06 23:26:35.277	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 23:24:33.719813	4f25c6a7-3a3c-4cf6-b3e9-5d6b30411c72
407	3	2e35a4138a3b19e2c4fdbfaf73d60cd126a0754757af883278ee29984308159c	2026-11-13 23:26:42.26	2026-11-06 23:30:07.671	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 23:26:42.265037	8d45fbe7-0e4d-49ee-8dfd-1b826b81893b
408	3	872963a7c2c0f5729bf62643aabcc7f51754d03f97540b917be5d83dffd89db0	2026-11-13 23:32:27.919	2026-11-06 23:48:04.114	409	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 23:32:27.924969	2130f217-e8c0-4c32-a31a-a2586e8faf05
409	3	d2e014bb4db1a675342fb6c3d1ff6f4e72330a8d386641571da9ce486acdf71b	2026-11-13 23:48:04.098	2026-11-06 23:54:12.155	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 23:48:04.111252	2130f217-e8c0-4c32-a31a-a2586e8faf05
411	3	d1212236f2d8c51f6968976866a1814791534c5243ee0aa0cfae6bcdcf72f191	2026-11-14 00:10:04.1	2026-11-07 00:18:19.12	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 00:10:04.115418	51cf3871-f285-48d1-af08-fa5a3b7b2711
387	4	c650e13f0dd875063ab57f095b18a9631a3b7117f8e8879c6b83b434becce60c	2026-11-13 22:35:29.291	2026-11-07 00:11:27.438	412	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-06 22:35:29.29985	e00bb1b7-7bed-449d-9d49-5cdeaa49eb00
410	3	0cefc36a65b78d5e7d8e3b2683f5331b3b3e9209be9805d3bccd56a88a76bb84	2026-11-13 23:54:24.191	2026-11-07 00:10:04.117	411	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-06 23:54:24.210563	51cf3871-f285-48d1-af08-fa5a3b7b2711
412	4	35c190ed8ff29321522f51faa32f2144d3ec990e171d6c59f1abb325a08c833e	2026-11-14 00:10:59.793	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-07 00:10:59.815749	e00bb1b7-7bed-449d-9d49-5cdeaa49eb00
413	3	37a9f2626db810fbbf6b50d719c7d0d22ad4106dc52c0b8dbbd651f69e8d4e89	2026-11-14 00:12:00.192	2026-11-07 00:27:04.117	415	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-07 00:12:00.21864	2aade671-5975-4080-8b1a-33bc7e36ae35
414	2	41c04ab916a9176833843a4b7b84cb751e4a072fbb9123bbfdf0ce3efd8d3489	2026-11-14 00:18:27.732	2026-11-07 00:34:04.117	416	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 00:18:27.750311	fb2b98f0-da61-4d42-a2b5-7d7f95b00261
416	2	36b6cb9147f8a9fc3c7b8131b7b401f9f6cabedd9ca9cc84ecfb95aa943a51a3	2026-11-14 00:34:04.096	2026-11-07 01:49:48.956	417	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 00:34:04.114515	fb2b98f0-da61-4d42-a2b5-7d7f95b00261
417	2	0d7eaa2ab0f4fc3f6f3d108b0936f44b85c357ee13a63b6784c4e2ac9a378c8d	2026-11-14 01:49:48.895	2026-11-07 01:49:51.847	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 01:49:48.944252	fb2b98f0-da61-4d42-a2b5-7d7f95b00261
418	3	cae13e22d5d70f83cc1b57e9f7c146a64270d966a905e5e01f0bc61bc65a88bb	2026-11-14 01:50:00.429	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 01:50:00.45603	06f48dae-8922-4c95-b160-5a6a39d2c3ee
419	3	cfdebe4900a37bbba18492aabfae640790342d506b9c777cc390ff18edb62a17	2026-11-14 01:51:20.053	2026-11-07 02:05:04.167	420	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 01:51:20.060301	0e5fc744-574d-40f3-91b1-261223af02c4
421	3	6fe6927528f52b5f5078c949c778d4da1d8d4ffdc7b3fa89a06edaf0f589696e	2026-11-14 02:05:11.475	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 02:05:11.501175	cc9a694c-d954-4dcc-ac7a-48d91b9c5ef3
420	3	d484a34f48037230b2088ef5c18eb971001bc9c03e9b4fd3f54d4c4391023ffd	2026-11-14 02:05:04.11	2026-11-07 02:06:51.278	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 02:05:04.156444	0e5fc744-574d-40f3-91b1-261223af02c4
422	3	f82279fb4e68f1b1453f75d1d0a2897f6cb4dbb59e18d9e5c3548adecd213596	2026-11-14 02:07:01.337	2026-11-07 02:07:41.128	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 02:07:01.343633	9c1b92a4-9345-4027-85fd-0d80fe060fc5
423	4	429f806648c0b73a3841b29704ea2f4efee6192bb26e3035701561c5ec9ad99d	2026-11-14 02:07:48.52	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 02:07:48.539876	564c6ebf-063f-40b9-959d-ab9eeecfa6f6
424	4	688c3bbeff8101c2998fadbd50787fe2cd622c7792944ae984c2be18cb474100	2026-11-14 02:07:50.69	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 02:07:50.706138	17a674b3-f836-456b-8f39-acdd4392ea03
425	4	1a34949eb8ccf270da0c954286376bbdbac29b11c5fc65b63ea6855a5a5a82e1	2026-11-14 02:07:51.599	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 02:07:51.615932	b30ae0bb-fbce-4111-a1a0-117dea17d988
426	4	8faa9b23b733f15d35c82b936fbe892c60c4573f839221f5eaca734362a4025d	2026-11-14 02:07:52.127	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 02:07:52.142383	1fabff85-705b-4eab-b249-2abeb8a2eff2
427	4	6ed85de2a5adb2a16fa248033a1edb877096daa8714bddae25e1016232e77663	2026-11-14 02:07:52.36	2026-11-07 02:19:45.218	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 02:07:52.376179	fdae4243-f305-4557-ae80-434dade59fcd
430	3	ba949ae16dd19e9c068f0b8c68bac83a20c074aff0c2e2683e1dc0490a8fee14	2026-11-14 02:22:07.256	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-07 02:22:07.319613	2aade671-5975-4080-8b1a-33bc7e36ae35
415	3	1a7fbbffac5219126941276b742a655029199f1e39ceafd1d60a56861a7ddf5f	2026-11-14 00:27:04.104	2026-11-07 02:22:07.322	430	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-07 00:27:04.11564	2aade671-5975-4080-8b1a-33bc7e36ae35
428	3	4cad926454ba26fdbc2fa0078736f1ddf4c1377f491c093680789348711b3c5d	2026-11-14 02:19:00.308	2026-11-07 02:34:00.991	432	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 02:19:00.340077	db286fec-ffd8-4bcc-85aa-84366013362c
429	3	8dd5aca484aa84601c96f461f9a31a8912fac817c961ad8b29219e6115aa3d32	2026-11-14 02:20:15.519	2026-11-07 02:36:04.082	433	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 02:20:15.547708	8175ef1b-e611-41d0-92b8-3b64cf244841
431	3	36541808571eb4189525f1a86e5fefc275aa49b91759a628c5791201587b6ba3	2026-11-14 02:22:15.371	2026-11-07 02:38:04.113	434	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-07 02:22:15.376691	2f474add-93bb-44eb-abee-d30a78c2622d
433	3	8783faaa7e3f03ffe42cd1a860f6845d41cc6d3925a8489ccf1c0186b8e260ff	2026-11-14 02:36:04.075	2026-11-07 07:43:58.4	435	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 02:36:04.07987	8175ef1b-e611-41d0-92b8-3b64cf244841
432	3	cdb84fdbbdfebe050c2c1ddac6c6da6a2a152c914a8fb80718062c62c4f6f183	2026-11-14 02:34:00.968	2026-11-07 07:44:01.197	436	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 02:34:00.989039	db286fec-ffd8-4bcc-85aa-84366013362c
436	3	e07d8d93fc5bab1d332bdbfca41106bf01a63241ab96f534a435bc99c41346be	2026-11-14 07:44:01.189	2026-11-07 07:59:01.271	437	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 07:44:01.19611	db286fec-ffd8-4bcc-85aa-84366013362c
437	3	4d6ebcd0fa7323a7e976e5467807df6d1bb4cf76b667c4c8f0e7d7104b391825	2026-11-14 07:59:01.249	2026-11-07 08:14:01.38	439	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 07:59:01.26917	db286fec-ffd8-4bcc-85aa-84366013362c
438	3	c26fdf552cc77a161b0f0a47c2ba9516820184094ef0cd59e2ff2187dd300e92	2026-11-14 07:59:04.031	2026-11-07 08:14:04.148	440	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 07:59:04.046424	8175ef1b-e611-41d0-92b8-3b64cf244841
434	3	cd2453dfca74a2595c7285d6e1d3d34e7c066b6bae1a1edbe897fe0abfcf7e21	2026-11-14 02:38:04.102	2026-11-07 12:26:22.351	451	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-07 02:38:04.111641	2f474add-93bb-44eb-abee-d30a78c2622d
435	3	d383788535046c15c6caa0e9e6aa3726a7dc6a77d6120d41f89063001a88be81	2026-11-14 07:43:58.383	2026-11-07 07:59:04.047	438	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 07:43:58.397358	8175ef1b-e611-41d0-92b8-3b64cf244841
439	3	f01590cbfc77abbcdbc754849d1547e0bfb1ba707bc17dfc97bf4937172dae80	2026-11-14 08:14:01.357	2026-11-07 08:29:01.478	441	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 08:14:01.367708	db286fec-ffd8-4bcc-85aa-84366013362c
440	3	4d5586c3c55af85cee54d8956ad817c1b7b6219bf6c79fc7825bb5f2c0c3597d	2026-11-14 08:14:04.131	2026-11-07 08:29:04.263	442	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 08:14:04.147841	8175ef1b-e611-41d0-92b8-3b64cf244841
441	3	24e54114372bab236438797e2063d24744d61a3e7d17df2f9479e4d00724dcd9	2026-11-14 08:29:01.455	2026-11-07 08:44:01.618	443	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 08:29:01.478331	db286fec-ffd8-4bcc-85aa-84366013362c
442	3	d3507986af3235090d0b5eaab578ebb3d329b939dc791e88b9ebc8c357022789	2026-11-14 08:29:04.255	2026-11-07 08:44:04.47	444	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 08:29:04.264449	8175ef1b-e611-41d0-92b8-3b64cf244841
443	3	d963a728b2f81a6d51a9985c4bac620d4c6b37ef3b0a2af81e6663b68a6e6ffb	2026-11-14 08:44:01.599	2026-11-07 08:59:01.622	445	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 08:44:01.617211	db286fec-ffd8-4bcc-85aa-84366013362c
444	3	3605c950746b7e667ed0e4a1b6a4a4be3ce0b36ef6bee4f826ff7cbf67cafd7e	2026-11-14 08:44:04.448	2026-11-07 08:59:04.379	446	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 08:44:04.469854	8175ef1b-e611-41d0-92b8-3b64cf244841
445	3	a793fc10679fb19b93003bbc3f86e09a5d6ae71fdcd60335603052f00c2aef7b	2026-11-14 08:59:01.6	2026-11-07 11:59:58.806	447	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 08:59:01.62066	db286fec-ffd8-4bcc-85aa-84366013362c
446	3	a7cdad1ae509cfbd4f0d24a8de087cc045548e791e34ca58fd65299e66f240bf	2026-11-14 08:59:04.371	2026-11-07 12:00:07.144	448	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 08:59:04.377555	8175ef1b-e611-41d0-92b8-3b64cf244841
447	3	8c6bd865e0e25d4c41fc7d5076029c0091d1462125136c8a918907b3664e0460	2026-11-14 11:59:58.789	2026-11-07 12:15:01.01	449	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 11:59:58.803871	db286fec-ffd8-4bcc-85aa-84366013362c
448	3	1214343e691c76133d7ed099a7004ff01afc013c102cb8be798a6d7bd3074525	2026-11-14 12:00:07.106	2026-11-07 12:16:04.413	450	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 12:00:07.124338	8175ef1b-e611-41d0-92b8-3b64cf244841
451	3	58e684b1fd03f62a5a7d087122eec4fb278df2d48c7ae24c934be53335845bb9	2026-11-14 12:20:55.878	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-07 12:20:55.902644	2f474add-93bb-44eb-abee-d30a78c2622d
449	3	dd9e661e163cc2b87715be9c1a693c92ff41e188a3b6c7adbcf6a280861c317b	2026-11-14 12:15:00.999	2026-11-07 12:30:31.615	453	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 12:15:01.008894	db286fec-ffd8-4bcc-85aa-84366013362c
450	3	e06adac5ce6fe50a523325d4b696ceb81f1b1733465331527053a01fde750eec	2026-11-14 12:16:04.389	2026-11-07 12:31:04.46	454	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 12:16:04.40636	8175ef1b-e611-41d0-92b8-3b64cf244841
452	3	5280057c4f992dae21b653f1c09a7505f73e1ff563ba60cecf16188af41c99c4	2026-11-14 12:26:26.9	2026-11-07 12:37:16.423	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-07 12:26:26.906545	950d6fa0-698f-41e5-a141-6235454e26f4
453	3	af3c0d2a968870530675235efc32abff525dfc15be723bf78d5b0ee16c3f1e2c	2026-11-14 12:30:31.592	2026-11-07 12:45:31.567	456	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 12:30:31.613754	db286fec-ffd8-4bcc-85aa-84366013362c
454	3	b8edfc38065cb25615bb8f99bfe613fa1a32d9f58fd1f8243524ff285779c7fb	2026-11-14 12:31:04.445	2026-11-07 12:46:29.435	457	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 12:31:04.458149	8175ef1b-e611-41d0-92b8-3b64cf244841
455	3	0a0e1bab76e8db1713c9d2e866d85f3f0328a14ac387bea663cd062cfbffca8f	2026-11-14 12:37:20.517	2026-11-07 12:53:04.442	458	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-07 12:37:20.534384	458c7e08-3902-43ca-bf3d-cf03c6640ed4
456	3	23480bfab03828841263848dbf554a34c56a38dda251236312284d4c4debd2a7	2026-11-14 12:45:31.56	2026-11-07 13:00:31.59	459	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 12:45:31.564956	db286fec-ffd8-4bcc-85aa-84366013362c
457	3	d13a10d276d292c818d04b84ef56a027e88ac49d7f6afb965c4c26116112b2b5	2026-11-14 12:46:29.412	2026-11-07 15:17:13.895	460	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 12:46:29.434876	8175ef1b-e611-41d0-92b8-3b64cf244841
459	3	a021ab21a43512424e2e45981ad1440ab77a8e96db2de4f0e1b4ced9670243c0	2026-11-14 13:00:31.567	2026-11-07 15:17:31.589	461	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 13:00:31.587869	db286fec-ffd8-4bcc-85aa-84366013362c
461	3	3e14639f8675d6dd69fca65bc09e5a5dd51d15f0d315da4043f82499ba94c4b3	2026-11-14 15:17:31.557	2026-11-07 15:32:31.585	462	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 15:17:31.583589	db286fec-ffd8-4bcc-85aa-84366013362c
462	3	bdf6ddbdfdc899299585b2756419f4fad17f96202a3d4521914e24fb86b508ce	2026-11-14 15:32:31.569	2026-11-07 18:36:03.285	463	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 15:32:31.582225	db286fec-ffd8-4bcc-85aa-84366013362c
463	3	b001ebd7b3a8d9a9f438d0eb8d8ae8f1fc3a1e71f0ef650a2949eda2bc1c0440	2026-11-14 18:36:03.238	2026-11-07 20:00:57.392	465	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 18:36:03.279334	db286fec-ffd8-4bcc-85aa-84366013362c
464	3	4f7d49a5aa47328976a8bb8b51eea34a6535414e0bf302bfb0b6fec7bc0baf11	2026-11-14 18:36:09.976	2026-11-07 20:01:06.701	466	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 18:36:10.017005	8175ef1b-e611-41d0-92b8-3b64cf244841
458	3	a63ff5fd9d397950cb6a873ff793017b7ab0f22af2135556ced594c357d86b41	2026-11-14 12:53:04.43	2026-11-07 20:11:14.183	467	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-07 12:53:04.439924	458c7e08-3902-43ca-bf3d-cf03c6640ed4
460	3	801eb650995ab66702a4e87c82df50be7c5cbe0f159b160ce16e9de4334dc079	2026-11-14 15:17:13.85	2026-11-07 18:36:10.051	464	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 15:17:13.890366	8175ef1b-e611-41d0-92b8-3b64cf244841
467	3	521a413d92599a3cb5cc40388fe51ea5cfc5805fcb0a51f3a5de88c594cecbff	2026-11-14 20:11:14.163	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-07 20:11:14.1753	458c7e08-3902-43ca-bf3d-cf03c6640ed4
465	3	f43396510777b3ab3a206c2334f6c1718c82080824669957f7f70264c2b88a36	2026-11-14 20:00:57.261	2026-11-07 20:16:02.814	469	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 20:00:57.344166	db286fec-ffd8-4bcc-85aa-84366013362c
466	3	f01cd797d2d9e32cb21537250bee49c4fc8a4da66d57fad0b3096ef3ad9d8d8b	2026-11-14 20:01:06.689	2026-11-07 20:17:05.646	470	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 20:01:06.699035	8175ef1b-e611-41d0-92b8-3b64cf244841
468	3	accf897b5df314643c6f423fb423d1e023a2764bbe2acb3a65a16a196037cf23	2026-11-14 20:11:21.663	2026-11-07 20:27:05.636	471	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-07 20:11:21.671512	de965541-8303-4c46-b13d-40162a53bb1e
469	3	0dd80d5ddb9a2b85220ce5a754a8add492a64941ab1afe6211da9b4fe59ad3f3	2026-11-14 20:16:02.756	2026-11-07 20:31:02.185	472	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 20:16:02.809071	db286fec-ffd8-4bcc-85aa-84366013362c
470	3	76fdc3786a4a0f2370138700fef6fed065d0733039238771c30ec42ce78018ba	2026-11-14 20:17:05.633	2026-11-07 20:32:05.589	473	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 20:17:05.643471	8175ef1b-e611-41d0-92b8-3b64cf244841
471	3	4da8475e937a3fbfd286fffa64774c59be090a8f753ee39db1e5312d1932944f	2026-11-14 20:27:05.616	2026-11-07 20:41:11.816	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-07 20:27:05.626044	de965541-8303-4c46-b13d-40162a53bb1e
472	3	6bcb5477aed88d638b6a943b89f7a620c5e5cd4dcbc3b032f2f1e6c6a55cef7a	2026-11-14 20:31:02.161	2026-11-07 20:46:02.204	475	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 20:31:02.183413	db286fec-ffd8-4bcc-85aa-84366013362c
473	3	f3d962ea29198d8791c956c3510d0743c9608de8f0fd42bdd828e47896b320b7	2026-11-14 20:32:05.569	2026-11-07 20:47:05.658	476	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 20:32:05.587636	8175ef1b-e611-41d0-92b8-3b64cf244841
474	3	62c02f1188bf51255d43a3a965d04af1a3dbd3e142da8dafe54ed306180811b8	2026-11-14 20:41:58.164	2026-11-07 20:57:04.594	477	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-07 20:41:58.18495	7fda9c52-bd50-42f3-bb6c-0491f2587dcc
475	3	e2b851d3f42795c0e23b24965558b0c5663dfefe8931b3c288a77ea9aabe36c3	2026-11-14 20:46:02.17	2026-11-07 21:01:02.18	478	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 20:46:02.19963	db286fec-ffd8-4bcc-85aa-84366013362c
476	3	966504c6be1d864006f9fa688b6051cbd1ac3716dbfa3a11cab3ffad2364ff34	2026-11-14 20:47:05.629	2026-11-07 21:02:05.647	479	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 20:47:05.650968	8175ef1b-e611-41d0-92b8-3b64cf244841
478	3	fc52fa4423acbfb9bf144411e103d73ee0bf552fc63b078023002e27f676610d	2026-11-14 21:01:02.163	2026-11-07 21:16:02.195	480	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 21:01:02.178392	db286fec-ffd8-4bcc-85aa-84366013362c
479	3	d290810cba86fba96aee87a3fda079219efbac3e606c5fe3e6a3f6162cc8a9de	2026-11-14 21:02:05.633	2026-11-07 21:17:05.612	481	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 21:02:05.646358	8175ef1b-e611-41d0-92b8-3b64cf244841
480	3	dc8137f777e77afd9b4f704b74e8c003c4caf4b963a30b9944e1523bdc314ad1	2026-11-14 21:16:02.172	2026-11-07 21:31:02.18	482	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 21:16:02.192699	db286fec-ffd8-4bcc-85aa-84366013362c
481	3	61aaa0a0957af6268c8ec867fb8db28337797e5e78ee01e2a03df338ae8e84bc	2026-11-14 21:17:05.585	2026-11-07 21:32:05.601	483	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 21:17:05.607851	8175ef1b-e611-41d0-92b8-3b64cf244841
482	3	0d3cf4d8e9987ce10a941a766792772814a60aa800a613ef2af1ea4f9e1efde0	2026-11-14 21:31:02.157	2026-11-07 21:46:02.172	484	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 21:31:02.177503	db286fec-ffd8-4bcc-85aa-84366013362c
483	3	34ef6ff9b424bfb3b6e625b7ee76cc1a13f9f1fec756cf5a47a8344358ff9c4b	2026-11-14 21:32:05.584	2026-11-07 21:47:05.583	485	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 21:32:05.600525	8175ef1b-e611-41d0-92b8-3b64cf244841
484	3	4622dbfb32571eb1a3b58c78d509aa47ebc9e0a7695dabcee23a3ee60b0d509a	2026-11-14 21:46:02.16	2026-11-07 22:01:02.175	486	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 21:46:02.169795	db286fec-ffd8-4bcc-85aa-84366013362c
485	3	7b6d82b19835f210a6e804f8a666207404a793963698ac336b53ee9a0e8aeb3d	2026-11-14 21:47:05.573	2026-11-07 22:02:05.641	487	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 21:47:05.580937	8175ef1b-e611-41d0-92b8-3b64cf244841
486	3	a6cd8aa0d9e45aaf45e5dd648960da32e5550b31ed224a518efff7d163ef08a0	2026-11-14 22:01:02.162	2026-11-07 22:16:02.184	488	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 22:01:02.173224	db286fec-ffd8-4bcc-85aa-84366013362c
487	3	b4060b728d0423d520673a48d718c7cd99715bb9b51cae48a789a7ff66b6e7e1	2026-11-14 22:02:05.599	2026-11-07 22:17:05.584	489	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 22:02:05.638138	8175ef1b-e611-41d0-92b8-3b64cf244841
489	3	7faee6de6e0c92b69db4c0c7d1453dbb718c4946a625e04ca3e179afd9f5dda0	2026-11-14 22:17:05.574	2026-11-07 22:32:05.737	491	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 22:17:05.581985	8175ef1b-e611-41d0-92b8-3b64cf244841
490	3	6ee75b21d062f8b6fe53b8e825573d4ee7dd8b20c24e0ca2cfdcd92753a18b39	2026-11-14 22:31:02.169	2026-11-07 22:46:02.493	492	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 22:31:02.180083	db286fec-ffd8-4bcc-85aa-84366013362c
477	3	d277dc9c1ec45b413a034a27ca579fa48b2929baad5751e9efef0c281c54e02c	2026-11-14 20:57:04.57	2026-11-08 06:01:07.001	551	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-07 20:57:04.588541	7fda9c52-bd50-42f3-bb6c-0491f2587dcc
488	3	1dcbd1b4ebffcb84b7e4e3c478b474e4a502110bee271c0ac6c14d5d27b6781d	2026-11-14 22:16:02.172	2026-11-07 22:31:02.181	490	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 22:16:02.18272	db286fec-ffd8-4bcc-85aa-84366013362c
491	3	dc3bc336a375bcc0978afc9efa868bf211f9faa69b2888764e56cd84d4b56675	2026-11-14 22:32:05.715	2026-11-07 22:47:05.589	493	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 22:32:05.734712	8175ef1b-e611-41d0-92b8-3b64cf244841
492	3	9dba30724b14e6bd8b4b506d5538a75f65f5b8effc943497d353a1637f96e65c	2026-11-14 22:46:02.467	2026-11-07 23:01:02.497	494	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 22:46:02.482631	db286fec-ffd8-4bcc-85aa-84366013362c
493	3	b6adf084a554071b5736dfd0e1f49e994d2e903bcf4eebd33f672896e021a6b5	2026-11-14 22:47:05.571	2026-11-07 23:02:05.589	495	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 22:47:05.58766	8175ef1b-e611-41d0-92b8-3b64cf244841
494	3	835e7bf295d01da65547f9ee073a1e9f9b04d063d0b08ff4bab77dab466991f8	2026-11-14 23:01:02.485	2026-11-07 23:16:02.512	496	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 23:01:02.49529	db286fec-ffd8-4bcc-85aa-84366013362c
495	3	c4503359b7be077c08ae0c328c48d1bd34c67931c39cce445d91c6f5ca5adb7b	2026-11-14 23:02:05.581	2026-11-07 23:17:05.589	497	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 23:02:05.586913	8175ef1b-e611-41d0-92b8-3b64cf244841
496	3	3d1eb67d58f5e1b5dd272099c9e8ad5f18fdf5725283f821dfd25f1cc3cf9d91	2026-11-14 23:16:02.488	2026-11-07 23:31:02.502	498	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 23:16:02.509629	db286fec-ffd8-4bcc-85aa-84366013362c
497	3	5b9d7170fdaa634df85aa3da40829d658ece0fe80a658c0d2e0987656794b727	2026-11-14 23:17:05.571	2026-11-07 23:32:05.589	499	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 23:17:05.587833	8175ef1b-e611-41d0-92b8-3b64cf244841
498	3	b1ae03c2196a9e9a56a3fbf01e86b9ef4de52931c935d5ba0df488af2b09c5b1	2026-11-14 23:31:02.479	2026-11-07 23:46:02.503	500	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 23:31:02.5026	db286fec-ffd8-4bcc-85aa-84366013362c
499	3	d82bc57a593acd122b458ff1a4f04083e722dfac2ee57a4adb84e40e68e40b89	2026-11-14 23:32:05.573	2026-11-07 23:47:05.582	501	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 23:32:05.587133	8175ef1b-e611-41d0-92b8-3b64cf244841
500	3	aa7a650847ec0cd365f3910010ad26a68a76826167c6a197630e18ba4a046bbf	2026-11-14 23:46:02.491	2026-11-08 00:01:02.185	502	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-07 23:46:02.504356	db286fec-ffd8-4bcc-85aa-84366013362c
501	3	b6b28d3722480ba99346767ba9042c51f6b4ac24e6bb01d44982767fe19b3291	2026-11-14 23:47:05.574	2026-11-08 00:02:05.584	503	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-07 23:47:05.581625	8175ef1b-e611-41d0-92b8-3b64cf244841
502	3	038182ba166e27b77940b8516908cf5aad073c03f22ab7bb272499b08698459f	2026-11-15 00:01:02.162	2026-11-08 00:16:02.181	504	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 00:01:02.184338	db286fec-ffd8-4bcc-85aa-84366013362c
503	3	d5645f45779151e70701003e58b9834c7b7b5e8c1ad6e3978277dacd4eeee590	2026-11-15 00:02:05.576	2026-11-08 00:17:05.579	505	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 00:02:05.584154	8175ef1b-e611-41d0-92b8-3b64cf244841
504	3	2a5509a39f4d812c3983faef9b5a53bb64f7cb4815e52f8e7ea541f746619880	2026-11-15 00:16:02.158	2026-11-08 00:31:02.179	506	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 00:16:02.178927	db286fec-ffd8-4bcc-85aa-84366013362c
505	3	0721d1fc8f7adb213d09f0928b6d59b94b7f25a86ffe7196c0405f4a86f3c8f0	2026-11-15 00:17:05.571	2026-11-08 00:32:05.603	507	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 00:17:05.578825	8175ef1b-e611-41d0-92b8-3b64cf244841
506	3	5eac0a81b627afc809d7f2ac228cc90562a555d1c3076000e27871330d45ded8	2026-11-15 00:31:02.157	2026-11-08 00:46:02.18	508	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 00:31:02.180312	db286fec-ffd8-4bcc-85aa-84366013362c
507	3	1488e8aca55fb402e9d673f68b9425fd253c8df6f8f15a19db000292cce7a04f	2026-11-15 00:32:05.581	2026-11-08 00:47:05.584	509	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 00:32:05.600271	8175ef1b-e611-41d0-92b8-3b64cf244841
508	3	756a1993d2f45af7a9710062f01f054290ea203abadea3daad2cc35f4370c111	2026-11-15 00:46:02.158	2026-11-08 01:01:02.178	510	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 00:46:02.180764	db286fec-ffd8-4bcc-85aa-84366013362c
509	3	f77b9bd935d6d3bac2075e48880d17507759b05c6254551fcb0389323252b29d	2026-11-15 00:47:05.565	2026-11-08 01:02:05.596	511	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 00:47:05.584167	8175ef1b-e611-41d0-92b8-3b64cf244841
510	3	a9ac8bd8a01242f9aefed90ac442e850da0634bd28d3232c927328c701207d7a	2026-11-15 01:01:02.156	2026-11-08 01:16:02.161	512	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 01:01:02.177301	db286fec-ffd8-4bcc-85aa-84366013362c
511	3	8d307ccb4c0cf1218d2ef39edf97bdfafa4c83fcfbd554239b2a07ca161f8b6d	2026-11-15 01:02:05.577	2026-11-08 01:17:05.598	513	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 01:02:05.593997	8175ef1b-e611-41d0-92b8-3b64cf244841
512	3	f4d7d9f91663d654b4ab2844b2a19d42f9b0b5dda184f4e61a56c2a1a7dd5828	2026-11-15 01:16:02.15	2026-11-08 01:31:02.179	514	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 01:16:02.161579	db286fec-ffd8-4bcc-85aa-84366013362c
513	3	2be023d059c56d067950dc8cdb52f198216dcae96ef01b3152b9ceede0c050d9	2026-11-15 01:17:05.58	2026-11-08 01:32:05.603	515	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 01:17:05.597522	8175ef1b-e611-41d0-92b8-3b64cf244841
515	3	f7c9d22bc44ea61715a7613928c0b14f4d2225b33b40da34e3010b13d9e804e5	2026-11-15 01:32:05.581	2026-11-08 01:47:05.591	517	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 01:32:05.600783	8175ef1b-e611-41d0-92b8-3b64cf244841
516	3	396ce5ee7968f3cdf5c98e1d5c2e71651398e663a7bf729dbc9543eb04c07b42	2026-11-15 01:46:02.19	2026-11-08 02:01:02.178	518	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 01:46:02.200335	db286fec-ffd8-4bcc-85aa-84366013362c
514	3	76918f7f93c496080ec96b20480bce4c42ba8295b6f02090661b06e340204730	2026-11-15 01:31:02.168	2026-11-08 01:46:02.202	516	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 01:31:02.177523	db286fec-ffd8-4bcc-85aa-84366013362c
517	3	570e00eb34a81b437c4551ee13d76910cd6cce2d1c21e3232ce13cba6aff354f	2026-11-15 01:47:05.578	2026-11-08 02:02:05.587	519	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 01:47:05.592762	8175ef1b-e611-41d0-92b8-3b64cf244841
518	3	958da45a883df40866cbfa3a7764bff792ad4dec76cb49dcdc44d816f206669d	2026-11-15 02:01:02.156	2026-11-08 02:16:02.191	520	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 02:01:02.166123	db286fec-ffd8-4bcc-85aa-84366013362c
519	3	f09361a659df321dfdb72eccb2b8456100aab36ce3ba25e5fbb68853fbd29af1	2026-11-15 02:02:05.58	2026-11-08 02:17:05.613	521	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 02:02:05.585788	8175ef1b-e611-41d0-92b8-3b64cf244841
520	3	822c2b505cb28d9a88edf3353f751acc5c2b2ad235cc1d2d2194d5925b355d6a	2026-11-15 02:16:02.167	2026-11-08 02:31:02.172	522	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 02:16:02.189946	db286fec-ffd8-4bcc-85aa-84366013362c
521	3	1f9ba5688ba6e4f7d284c7a1e266fd550b578f2423a82babcaa444f6d1fa5414	2026-11-15 02:17:05.589	2026-11-08 02:32:05.599	523	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 02:17:05.609988	8175ef1b-e611-41d0-92b8-3b64cf244841
522	3	a0e12f07705d0f5b2717569ba8613b0e7d17208f09c5ff34ee9f69264270e35e	2026-11-15 02:31:02.16	2026-11-08 02:46:02.173	524	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 02:31:02.171668	db286fec-ffd8-4bcc-85aa-84366013362c
523	3	3384a86a755c7f032ec317760db9c177c8bd6af02f95be6a268f6c8101cc7c9a	2026-11-15 02:32:05.578	2026-11-08 02:47:05.595	525	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 02:32:05.597891	8175ef1b-e611-41d0-92b8-3b64cf244841
524	3	33e3d9206181aee5b29ee6ed062ae96d582af5bd4e0255f2ccee8c2d6c291c60	2026-11-15 02:46:02.162	2026-11-08 03:01:02.217	526	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 02:46:02.171476	db286fec-ffd8-4bcc-85aa-84366013362c
525	3	60aefbed193828915957608b1ab2c4fae5618d612c2197c2cfb5559bc9553fba	2026-11-15 02:47:05.576	2026-11-08 03:02:05.582	527	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 02:47:05.593013	8175ef1b-e611-41d0-92b8-3b64cf244841
526	3	ecc502bcb69ca497998473da9f8cca179763bdfec61283766cdbedbbc866de2c	2026-11-15 03:01:02.185	2026-11-08 03:16:02.178	528	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 03:01:02.210024	db286fec-ffd8-4bcc-85aa-84366013362c
527	3	4b642f3ecf5c3ee624d626ca74e9eb317f90e4653571339e17515fb855e17b3b	2026-11-15 03:02:05.564	2026-11-08 03:17:05.596	529	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 03:02:05.581969	8175ef1b-e611-41d0-92b8-3b64cf244841
528	3	5469c5f4e184ba737173ae6bbd23b41338e449a0167e8c4716fd9d12468b2d65	2026-11-15 03:16:02.155	2026-11-08 03:31:02.199	530	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 03:16:02.175803	db286fec-ffd8-4bcc-85aa-84366013362c
529	3	086ec5a396a583a9a5d6db50c74d9f3cc70454ba8fa09a5da81592ae5e4a79fc	2026-11-15 03:17:05.577	2026-11-08 03:32:05.591	531	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 03:17:05.595008	8175ef1b-e611-41d0-92b8-3b64cf244841
530	3	c1fa06883d873f148cdfd67df4817b3a832cb59ffe54232ba1923eb400ce0d49	2026-11-15 03:31:02.176	2026-11-08 03:46:02.179	532	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 03:31:02.196219	db286fec-ffd8-4bcc-85aa-84366013362c
531	3	1fbb3de5087bed79597564ffa0ad46ea961bc4b0abf36a93491e7e3e67a4638d	2026-11-15 03:32:05.573	2026-11-08 03:47:05.578	533	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 03:32:05.589594	8175ef1b-e611-41d0-92b8-3b64cf244841
532	3	c81fe9674d2b3efd90f99505689a6d2b0bc88da221b8b7b29a9be0cd8249bca5	2026-11-15 03:46:02.167	2026-11-08 04:01:02.189	534	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 03:46:02.177891	db286fec-ffd8-4bcc-85aa-84366013362c
533	3	3649abcb95e73a7ff7032a93dcd1d96baaadc046e337375ed26dfeb3caf4d06c	2026-11-15 03:47:05.57	2026-11-08 04:02:05.603	535	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 03:47:05.57602	8175ef1b-e611-41d0-92b8-3b64cf244841
534	3	d69bdf45825c742e9ab54307f9b17499d506189cf0cf5943bdf7d5f35f760cc9	2026-11-15 04:01:02.166	2026-11-08 04:16:02.37	536	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 04:01:02.198537	db286fec-ffd8-4bcc-85aa-84366013362c
535	3	e3a9c1d67d3e0558b95dc56e7222b2397369ae435f0723e60b223d0890921b64	2026-11-15 04:02:05.593	2026-11-08 04:17:05.782	537	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 04:02:05.601734	8175ef1b-e611-41d0-92b8-3b64cf244841
536	3	31e2300a6644a553324240276d8d989e74da6cbaca6019cc2f19cfae8108a2db	2026-11-15 04:16:02.344	2026-11-08 04:31:02.506	538	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 04:16:02.366279	db286fec-ffd8-4bcc-85aa-84366013362c
537	3	6dbd23d6d422cf76b6f374af666ff91a5187ccc530ff79547f54716687d3d35d	2026-11-15 04:17:05.776	2026-11-08 04:32:05.906	539	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 04:17:05.785178	8175ef1b-e611-41d0-92b8-3b64cf244841
538	3	2feca3bbff2c4a0b3739f3ac8f7b884315e3875e340a239974f4a8e6f0c59e08	2026-11-15 04:31:02.495	2026-11-08 04:46:02.603	540	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 04:31:02.509226	db286fec-ffd8-4bcc-85aa-84366013362c
539	3	6ed03ae925132fdcad58d4365c4f42e201b3b1ae4742d6b774afd90ac6f48f3f	2026-11-15 04:32:05.897	2026-11-08 04:47:06.217	541	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 04:32:05.908621	8175ef1b-e611-41d0-92b8-3b64cf244841
541	3	1b11be515838d11e4428eac420da6acfbe4f20570b92279b263b2e9891d90238	2026-11-15 04:47:06.196	2026-11-08 05:02:06.083	543	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 04:47:06.222243	8175ef1b-e611-41d0-92b8-3b64cf244841
542	3	58e9c9cccd88fc20908c75d9f0be204fcd6639ac474b8d14cf9dc397d43d5e6e	2026-11-15 05:01:02.65	2026-11-08 05:16:02.75	544	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 05:01:02.661131	db286fec-ffd8-4bcc-85aa-84366013362c
540	3	c50cf9c68012d1c62bb7a910488fe85445aebaf0217da1dc61d0fbdd5cc79c16	2026-11-15 04:46:02.589	2026-11-08 05:01:02.662	542	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 04:46:02.601556	db286fec-ffd8-4bcc-85aa-84366013362c
543	3	4aad5a73c7064188746867df81feea8006dae5135d5a1efdd93c7c4b9c8f915c	2026-11-15 05:02:06.065	2026-11-08 05:17:06.232	545	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 05:02:06.082876	8175ef1b-e611-41d0-92b8-3b64cf244841
544	3	70bbf9949481bd055c63668542033b002e67fc40063ef60184884f5fad5b51ef	2026-11-15 05:16:02.729	2026-11-08 05:31:02.762	546	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 05:16:02.743691	db286fec-ffd8-4bcc-85aa-84366013362c
545	3	cd5ac4f764949efb8789882fbe43441b9cb2e99c32b8e73b45b2026b5e46230a	2026-11-15 05:17:06.212	2026-11-08 05:32:06.183	547	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 05:17:06.230145	8175ef1b-e611-41d0-92b8-3b64cf244841
546	3	776ec72375114b9953d6c9fb4461504c0dedb5ff080d1242265d575325eed0b8	2026-11-15 05:31:02.751	2026-11-08 05:46:02.796	548	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 05:31:02.762819	db286fec-ffd8-4bcc-85aa-84366013362c
547	3	55d03a7d5b6d68a8a96a3fa9a3b2d1ad671950441b354fecd8e6ee0af3fa991c	2026-11-15 05:32:06.163	2026-11-08 05:47:06.209	549	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 05:32:06.181429	8175ef1b-e611-41d0-92b8-3b64cf244841
548	3	cacdfe1765e7abceef9ab3ca2b7b1b07cbfe949cd28b949c4e67b97ab4dc9380	2026-11-15 05:46:02.784	2026-11-08 06:01:02.839	550	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 05:46:02.793846	db286fec-ffd8-4bcc-85aa-84366013362c
549	3	5882755daaab127148612d0f82b3b2d4e1c950c591180f0bcc4d18cb5523c09b	2026-11-15 05:47:06.191	2026-11-08 06:02:06.223	552	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 05:47:06.207939	8175ef1b-e611-41d0-92b8-3b64cf244841
550	3	b5d39f9fec96481de8a93cab451c3d9f4772aebd618ef0b7aa9a1d4897d622dd	2026-11-15 06:01:02.815	2026-11-08 06:16:02.829	553	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 06:01:02.835934	db286fec-ffd8-4bcc-85aa-84366013362c
551	3	ab70731af327753da3c603c55c2f856ebca916a2a50d0b647dcdd82b75f26044	2026-11-15 06:01:06.958	2026-11-08 06:16:15.621	554	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-08 06:01:06.983122	7fda9c52-bd50-42f3-bb6c-0491f2587dcc
552	3	de6d2b33de98caf676f92b8ba9c741e6ad2ed9e070ab2daab31be6700c97773d	2026-11-15 06:02:06.205	2026-11-08 06:17:06.249	555	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 06:02:06.223685	8175ef1b-e611-41d0-92b8-3b64cf244841
553	3	74439c1acbfe09324257f7bbb375ed694bb5b32868ec34ba5b2677bdbb0e2e6a	2026-11-15 06:16:02.806	2026-11-08 06:31:02.863	556	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 06:16:02.827115	db286fec-ffd8-4bcc-85aa-84366013362c
554	3	8b808bb33adff7d46f59680bc1dd4e5dcaf65eccdaf8f90044419b247c842cdc	2026-11-15 06:16:15.614	2026-11-08 06:31:15.235	557	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-08 06:16:15.62013	7fda9c52-bd50-42f3-bb6c-0491f2587dcc
555	3	c50058e0f9deb2bf89825e0b13b6c144e72000f0642845cd7b6d810be1c166d1	2026-11-15 06:17:06.241	2026-11-08 06:32:06.327	558	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 06:17:06.24991	8175ef1b-e611-41d0-92b8-3b64cf244841
558	3	e920c15bd1668f74a84deebe952cf8983900b9ae950c4d4d3d65ba1d2deaa971	2026-11-15 06:32:06.304	2026-11-08 06:47:06.305	559	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 06:32:06.323573	8175ef1b-e611-41d0-92b8-3b64cf244841
559	3	ef07fc0f4b43846f870642f2e04d87e6a3505614af43108293dc601fa1b593d6	2026-11-15 06:47:06.291	2026-11-08 07:02:06.333	560	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 06:47:06.302395	8175ef1b-e611-41d0-92b8-3b64cf244841
560	3	0ac998cfb23f6146d54b54a0fd486cb3ff9eb2e7143923d09c59580fd7203e13	2026-11-15 07:02:06.303	2026-11-08 07:17:06.321	561	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 07:02:06.326418	8175ef1b-e611-41d0-92b8-3b64cf244841
561	3	6de2f2485a96a656eaf280a5bd002ab899d80a1024da2a4898343ba484111831	2026-11-15 07:17:06.308	2026-11-08 07:32:06.337	562	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 07:17:06.319182	8175ef1b-e611-41d0-92b8-3b64cf244841
562	3	711a785a78de1a9a8f8c003dda24812e9a3d467e7cb0add4bb2ae4515502c1a8	2026-11-15 07:32:06.323	2026-11-08 07:46:20.134	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 07:32:06.334317	8175ef1b-e611-41d0-92b8-3b64cf244841
563	3	02f832378c5d179fa920436d046e3191b83b232b2028fe1d8fe1c3d82c2e869e	2026-11-15 07:46:28.836	2026-11-08 08:01:34.93	564	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 07:46:28.841752	d99bd27a-01bc-43d1-8106-0c94ea72e565
564	3	a81e7f7668631f72acb278a1c9f2bcccfc016286f3c9fc2855f60ee3efea4e3b	2026-11-15 08:01:34.903	2026-11-08 08:17:06.329	565	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 08:01:34.92511	d99bd27a-01bc-43d1-8106-0c94ea72e565
565	3	4ccef37753fbde03ccd41bf61af6bfabb6cb16b557fe4258ba5c7b00489613bb	2026-11-15 08:17:06.317	2026-11-08 08:32:06.349	566	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 08:17:06.326398	d99bd27a-01bc-43d1-8106-0c94ea72e565
566	3	8e3974fb21f098b9c909e301f6e077f47d312d5f2e8f15f4ca9e7b55c9916546	2026-11-15 08:32:06.317	2026-11-08 08:44:00.744	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 08:32:06.34587	d99bd27a-01bc-43d1-8106-0c94ea72e565
567	3	b9ae760ec05febdafcabacb6bbd7fad10892945d954ae3383ef5d7b892f54c9f	2026-11-15 08:44:12.057	2026-11-08 08:45:59.412	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 08:44:12.079727	7ea893cc-4892-448f-bb6f-f622399b98ba
568	3	abea4436ca3d32dbffb9a97fc85283d6bfe2c8ac8b69cec8a8eaa811ec4d36b8	2026-11-15 08:46:02.732	2026-11-08 08:46:30.626	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 08:46:02.748216	833c00d5-6b1a-463a-bac3-6385140cecf9
556	3	dfa4c045303168eeb6a7b5cf2d1cf1a6094d6aed60922c74d8b7e90894c93fd9	2026-11-15 06:31:02.839	2026-11-08 18:30:09.604	615	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 06:31:02.862089	db286fec-ffd8-4bcc-85aa-84366013362c
569	3	10e5ff2824d47d7c406168e547480ae40c5aa5b0afcb4f2b9688061e0a556264	2026-11-15 08:46:35.065	2026-11-08 09:02:06.335	570	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 08:46:35.070551	4e072ba5-0d17-4383-a509-47e0f9f09a24
570	3	1e3bd6fb7e0a255cf440152c259e9d9b8f02feaa683255c791db5ec61af80dba	2026-11-15 09:02:06.31	2026-11-08 13:15:18.974	571	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 09:02:06.323181	4e072ba5-0d17-4383-a509-47e0f9f09a24
571	3	7e696b842fd2c93bff582a37af57b1610001443f7136073a277e6346f8469a88	2026-11-15 13:15:18.843	2026-11-08 13:31:06.312	572	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 13:15:18.967697	4e072ba5-0d17-4383-a509-47e0f9f09a24
572	3	2738a171a237b2b8edb5533ba2104ae562a800ec8b0022dce5974c7fe8cddcdf	2026-11-15 13:31:06.299	2026-11-08 13:44:29.696	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 13:31:06.311177	4e072ba5-0d17-4383-a509-47e0f9f09a24
573	3	b721aa2ffd79ee473f10f91012c357e54282138b33ed6df45ecd17603ba3f2fb	2026-11-15 13:45:17.923	2026-11-08 14:00:19.33	574	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 13:45:17.944857	cc78a120-4f92-4983-a8f3-fb352075b1c7
574	3	05755ec350cca9b0e0a14e1e5b927c43a2f445b1cd87956d9a452ce27c467fa0	2026-11-15 14:00:19.306	2026-11-08 14:15:36.391	575	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 14:00:19.327462	cc78a120-4f92-4983-a8f3-fb352075b1c7
557	3	afd3e5d0780dbed293e2442f6630d1170d7e6e92f201acd97544d98b6b3371e0	2026-11-15 06:31:15.217	2026-11-08 14:16:05.659	576	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-08 06:31:15.233163	7fda9c52-bd50-42f3-bb6c-0491f2587dcc
575	3	04d08c91fb441a317d53c5e2685e94c0d37aab88d2352b2b8062ecda95db4b14	2026-11-15 14:15:36.378	2026-11-08 14:16:31.259	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 14:15:36.389709	cc78a120-4f92-4983-a8f3-fb352075b1c7
577	3	7dcfba196b8e7d015ae4725831d48da870662e782c49fc9cc3bd0bbb6f0ae150	2026-11-15 14:17:01.368	2026-11-08 14:17:04.681	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 14:17:01.395253	192b3f64-8178-4548-9c40-83d7fb468357
578	3	8400a912660afdf8edb143e92e12df6b1a9cd0d1c33d3ca76f21cb27129218f8	2026-11-15 14:21:09.892	2026-11-08 14:36:37.317	579	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 14:21:09.907444	52d4c0cd-a74b-4b58-bd97-0735b07e2f49
579	3	04bbbef55e3e1ab130e9edddaca11a95d0ea1f326c5954df2565360c2b64c491	2026-11-15 14:36:37.3	2026-11-08 14:38:24.228	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 14:36:37.312431	52d4c0cd-a74b-4b58-bd97-0735b07e2f49
580	3	96fc17113504284107f0ca6c4269404d432c1b3a8fb83479991c9586fdc7b62e	2026-11-15 14:42:28.066	2026-11-08 14:42:32.778	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 14:42:28.090359	65607827-de2a-4b5f-88a2-db923947e7ed
581	3	674260fd2aee14c62a897b64e95032d5a02cba85f0646b6acb39e3fa334f1255	2026-11-15 14:42:53.742	2026-11-08 14:42:56.638	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 14:42:53.759463	8dacbb54-34d9-4f99-b34d-5dffd25dd4ab
582	4	506b1f6e94e27618b2dbc0927fbb1bf701db9c978400879ce8f964362b32216f	2026-11-15 14:47:50.934	2026-11-08 14:49:34.989	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 14:47:50.960923	13d02349-0b9e-4b82-a0da-af3aa4e4fdd2
583	3	df280749425fdb9741f474734528b3959e487cbbc402ada259380c9905b07018	2026-11-15 14:49:40.766	2026-11-08 14:54:40.351	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 14:49:40.772487	091ec890-4774-4d9c-9791-c02fdb1b6b3c
584	4	240d62f0ca0f2bc1106ec0673b8426f0dc0ba80a5e9f2e50ae5f8ddb9f082500	2026-11-15 14:54:49.976	2026-11-08 15:00:26.169	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 14:54:49.999262	63b2244d-1c96-4930-9e18-3708249abd8c
585	2	b4a10fd8a3f3258a574d5d80163d1c2f4d3f231bba1395ffc173ffa35a229e54	2026-11-15 15:00:34.013	2026-11-08 15:01:57.547	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 15:00:34.018629	59c00b66-5eec-4875-8c53-adbdaaab2fd1
586	5	466b935e1a533e8ceb19ecf91496db6451ce86a7b1954034974b17e8fa5313b6	2026-11-15 15:02:05.247	2026-11-08 15:03:33.761	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 15:02:05.25217	d3ebc9f0-3ab5-4d57-81d1-4dbfc13fea86
587	2	ee4ba3112156f68b20c1a735f7053c0ab7bb6aa8433907e99c11ee170d28210e	2026-11-15 15:04:13.108	2026-11-08 15:05:15.71	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 15:04:13.119516	975ec4b2-6604-45bc-9598-5a2aea8f4ab5
588	3	1ae62bb4c51d35e13e60b92dbd60ca4efd6886ff8fcb5fc1dfca10f351851057	2026-11-15 15:05:25.113	2026-11-08 15:06:56.105	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 15:05:25.143123	790680f2-edf8-4613-952a-a9df41b6f25e
589	3	66524d79be349be5688261c6368e63f1877fc7ffbf355e96bbf6271bc7b9bfab	2026-11-15 15:07:51.265	2026-11-08 15:15:12.541	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 15:07:51.275737	b920c6dc-be00-4e33-9c19-3877b05a02b2
590	11	fbc67a28717e031b40b33f64f9faff67efcf9d9e5c3a49a1fff43ead5d10b7cb	2026-11-15 15:16:08.091	2026-11-08 15:18:40.439	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 15:16:08.109178	c9610565-78a3-4138-841e-3e7259b3ce57
591	3	85044e1d01cf4afda963dabf54a686293efb114bb68d7545c2250efc67452dde	2026-11-15 15:18:46.106	2026-11-08 15:32:34.939	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 15:18:46.122209	0239d857-9766-4d1f-bc97-a27c95520ead
592	3	a2c0a44b3979c3d04248b6222813211d9f99a940930c7cc42ae7327f027a9402	2026-11-15 15:32:38.905	2026-11-08 15:48:02.893	593	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 15:32:38.909192	7e4a433a-5a52-4f42-b41e-ae68b60e7a05
593	3	7fb62a42e2256717e2e788e86dcf2b927fdd790d61408d30d3365909bfc37406	2026-11-15 15:48:02.879	2026-11-08 16:03:06.909	594	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 15:48:02.893072	7e4a433a-5a52-4f42-b41e-ae68b60e7a05
576	3	8bd7a7225b9287b39093c1cf6a04d93136ba00c10f4a30261a72b859beec5557	2026-11-15 14:16:05.635	2026-11-08 16:21:10.932	596	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-08 14:16:05.653257	7fda9c52-bd50-42f3-bb6c-0491f2587dcc
595	3	c2e8825ba2f58642132b8d38e49dc706e171041cf6d1c2693d6e98be53bc4b04	2026-11-15 16:18:06.867	2026-11-08 16:33:10.867	597	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 16:18:06.880558	7e4a433a-5a52-4f42-b41e-ae68b60e7a05
594	3	4f6e0db75bba5e05761d2ee25c227782125be4800cfcb6c9421174c8a4a1bb9c	2026-11-15 16:03:06.897	2026-11-08 16:18:06.881	595	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 16:03:06.90659	7e4a433a-5a52-4f42-b41e-ae68b60e7a05
597	3	7bc8eee6e46006189b5beb251dc078d065575d435dcf272465f3ca83a9397af5	2026-11-15 16:33:10.855	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 16:33:10.87235	7e4a433a-5a52-4f42-b41e-ae68b60e7a05
596	3	88f75c246e0745e81d300c5363c39acf27c9c41a21d0088d8074f540fc54320b	2026-11-15 16:21:10.884	2026-11-08 16:37:06.35	598	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-08 16:21:10.910932	7fda9c52-bd50-42f3-bb6c-0491f2587dcc
599	3	556fc558adf2d0c85c06cd60576b83d6ac83b9d17c209d3a6432acaf259868e5	2026-11-15 16:45:55.863	2026-11-08 16:48:17.929	600	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 16:45:55.887505	d2fd222d-cc38-418b-8757-d4bfd57bb6d0
600	3	130e109a61f34aa93dc32e6bcb10862bfa9963748d2d220925ef75f1da7a449d	2026-11-15 16:48:17.88	2026-11-08 16:48:39.192	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 16:48:17.924714	d2fd222d-cc38-418b-8757-d4bfd57bb6d0
601	3	a673787a1ceda93d26a5efe49202b72d64349f3dc479cd2c8d3067ab700fab0a	2026-11-15 16:48:47.334	2026-11-08 16:53:47.287	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 16:48:47.351773	3e8d4ac3-8901-48bb-a3c1-2a2273f3107f
602	3	1a14e148b0aa09dd26260eab396b8a451b41a89798c7e17e8ad024b5c75059ef	2026-11-15 16:53:51.047	2026-11-08 16:58:02.573	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 16:53:51.077374	3c398f5d-39bc-43fa-9947-1177335b80c4
605	3	060d261e7b95b5ba1e8a7e28aa156b08b0d7b28f771e32c5d19ebbb87095a90e	2026-11-15 17:24:21.588	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-08 17:24:21.670696	7fda9c52-bd50-42f3-bb6c-0491f2587dcc
598	3	2945868383534af29b191b4c9b64f98db9b54a05236476c16178da0db6bd0c02	2026-11-15 16:37:06.306	2026-11-08 17:24:26.94	605	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-08 16:37:06.339823	7fda9c52-bd50-42f3-bb6c-0491f2587dcc
606	3	9fa0c3c715b12278778ad8cb8497fb7608bc82ea11ef3cd8195ed36f5afe1758	2026-11-15 17:24:30.363	2026-11-08 17:40:06.328	608	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-08 17:24:30.377959	56495c66-ebcc-4af7-82df-f6aa885f4b92
607	3	83ec5397c3f7f52881fe504d7e48158a69827f837c205baa3d0523bb0a39db9a	2026-11-15 17:25:28.652	2026-11-08 17:40:40.372	609	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 17:25:28.677346	7a6b301a-326c-436e-9ff4-a670891b4195
609	3	96f67e747295f5bb74624c792a504271b3ae677bb32bb6c74a38d6ddb18b7a37	2026-11-15 17:40:40.348	2026-11-08 17:52:28.521	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 17:40:40.369992	7a6b301a-326c-436e-9ff4-a670891b4195
610	3	769d55ab978c364c994cfc494571d4b0daaa58d50c2d3f4c17e9c9ad2a40ffd3	2026-11-15 17:52:31.887	2026-11-08 18:04:10.817	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 17:52:31.907383	34ac1423-652d-4ff5-bb45-186cf06d4946
611	3	ecb1969d7a49730c35890c402ea073ceb99751b003c95fb91231f9ced666b8da	2026-11-15 18:04:20.369	2026-11-08 18:20:06.895	612	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 18:04:20.395419	67c34929-4a93-4bd5-98b1-515597885871
612	3	95d50ff91e4e3608488832c591c11f394f1d97b6690bc1aa39be31a93c906933	2026-11-15 18:20:06.882	2026-11-08 18:20:18.116	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 18:20:06.893204	67c34929-4a93-4bd5-98b1-515597885871
614	3	fb87e545c2c1c90ec1a9e96b87eb4a482618a0087dc4c3b1e77a02e3d58c86eb	2026-11-15 18:26:21.817	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-08 18:26:21.845361	56495c66-ebcc-4af7-82df-f6aa885f4b92
613	3	7f5750e3f47aed34bf5286c4247bea9c23e91cc4cf6e2937f6398051e4f980c3	2026-11-15 18:21:28.752	2026-11-08 18:40:25.782	616	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 18:21:28.77946	67ee7293-c534-456d-80bb-0539dc7c70d1
617	3	a953a99af16dd6e3f0ce9608c379e8df1a6fcfae0dd2628300105b45363a8d9f	2026-11-15 18:45:13.973	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 18:45:13.995163	db286fec-ffd8-4bcc-85aa-84366013362c
615	3	beb23b6306c88679b87921111af2ebbd88ac2f9324d2140855710c1b6580b924	2026-11-15 18:30:09.59	2026-11-08 18:45:14.005	617	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	127.0.0.1	2026-11-08 18:30:09.603098	db286fec-ffd8-4bcc-85aa-84366013362c
616	3	2194dc7863dc812a6aee605d90b1b0e9023f43fecdc57e2a18a8f40d96d64f03	2026-11-15 18:40:25.757	2026-11-08 18:56:06.31	618	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 18:40:25.778966	67ee7293-c534-456d-80bb-0539dc7c70d1
618	3	0ec576a0275c217bad9354b6b6472431dcb8938c28d4f4027a9b22e375f727a6	2026-11-15 18:56:06.291	2026-11-08 19:11:06.314	619	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 18:56:06.308958	67ee7293-c534-456d-80bb-0539dc7c70d1
619	3	567b690175af2d4befaa81e8435810e64d50c591820bab94f47d92353d53c5c4	2026-11-15 19:11:06.291	2026-11-08 19:26:06.305	620	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 19:11:06.311849	67ee7293-c534-456d-80bb-0539dc7c70d1
620	3	456b4e6f14021486447811a6f7bf225297a865dd611856d5ce2b18eacb4b7ff5	2026-11-15 19:26:06.292	2026-11-08 19:50:15.952	621	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 19:26:06.303416	67ee7293-c534-456d-80bb-0539dc7c70d1
621	3	3b00e5c1cae42d02c98e6e0411a856054a7bbf36d49b93cf6bc85f2136ae8e2b	2026-11-15 19:50:15.932	2026-11-08 19:50:28.966	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 19:50:15.950136	67ee7293-c534-456d-80bb-0539dc7c70d1
608	3	c99aa9f14d1465409aa153c20fe974a688fb6552d1f97632f75d302d4005a413	2026-11-15 17:40:06.302	2026-11-08 21:42:41.19	614	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-08 17:40:06.324939	56495c66-ebcc-4af7-82df-f6aa885f4b92
622	3	6221dd8292be6df66dfe33e7e9874c0a11e822f4267ac94dafd5a355fdaa084e	2026-11-15 19:50:39.316	2026-11-08 19:50:52.032	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 19:50:39.338648	62c1e177-3e3b-4abf-819b-e34a2afe1472
623	3	a38ed56d5bacea493db1de12fe6ce0b2ef4066ea8ba6814c697b33100ffcca7d	2026-11-15 19:50:57.269	2026-11-08 20:06:22.302	624	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 19:50:57.285812	bd516357-cd5a-40c7-801d-c69df0ba3375
624	3	39e28f6e5db18c64a0ffb1699a3e0a79a52f56ab174197b7a154c25d550388d5	2026-11-15 20:06:22.282	2026-11-08 20:21:34.3	625	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 20:06:22.295315	bd516357-cd5a-40c7-801d-c69df0ba3375
625	3	ca568d9300c6bfa4c808ca1e25ea477746c1c7f2402e9c8e57766bc3b3391d2d	2026-11-15 20:21:34.287	2026-11-08 20:36:39.585	626	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 20:21:34.298036	bd516357-cd5a-40c7-801d-c69df0ba3375
626	3	e6c6db58d617fade271e7366ae003d03a9354ab9e46c84c72b80cb3d32ad2adc	2026-11-15 20:36:39.566	2026-11-08 20:51:52.636	627	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 20:36:39.581294	bd516357-cd5a-40c7-801d-c69df0ba3375
627	3	8803b26c3a44d876d419205c2b563b63b3377dd12661b91291be34c138fd21cd	2026-11-15 20:51:52.623	2026-11-08 21:06:53.534	628	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 20:51:52.639821	bd516357-cd5a-40c7-801d-c69df0ba3375
628	3	377c9daa822abfc0b59190c89efe7478b23f8aa9cca8ac311e1317bf2efef937	2026-11-15 21:06:53.503	2026-11-08 21:17:51.589	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 21:06:53.529468	bd516357-cd5a-40c7-801d-c69df0ba3375
629	4	ba28dbde6dfa799a664bae4eae6d0015cc6857bf9f6202acd44bd192862fc98f	2026-11-15 21:17:58.846	2026-11-08 21:18:40.9	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 21:17:58.871692	97089b51-d2ea-4936-9ef1-4265ddd6c69b
630	3	32efb361bebe79e1195afd8d11c78809e3c4fb507d403e14e3db63828c14daed	2026-11-15 21:18:48.803	2026-11-08 21:34:13.956	631	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 21:18:48.810292	e83ecf6e-d459-4c0c-9006-8b6d08657690
631	3	5be5c98feeef262c4a270de2d496c93a3f7560eef02c88142c3bdf76192d4457	2026-11-15 21:34:13.934	2026-11-08 21:50:06.326	633	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 21:34:13.954829	e83ecf6e-d459-4c0c-9006-8b6d08657690
634	3	b7081962e5af2d4b3d553f30ac2415be7e62a1c639c3458493cb4ca0547b47c6	2026-11-16 03:20:51.755	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 03:20:51.78441	e83ecf6e-d459-4c0c-9006-8b6d08657690
636	3	758ce201cb6282f0df11d17a14e57c56c4a30011c84c7d5858bad928699e05a5	2026-11-16 03:33:47.138	2026-11-09 03:33:57.076	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 03:33:47.169499	3f3fac2f-05b3-494b-9ab1-963c256d4383
633	3	d182aa87499b77b6e8bdb38cb811b8303591217b043f77b872d7d7ecabb05a09	2026-11-15 21:50:06.305	2026-11-09 03:25:06.212	634	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-08 21:50:06.317783	e83ecf6e-d459-4c0c-9006-8b6d08657690
635	3	f8b21fe78e65ce0ff6f564c2749d925e1babea67fa6f0cd38975ca50e9813a27	2026-11-16 03:31:16.819	2026-11-09 03:31:33.822	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 03:31:16.846737	6f0e8189-3502-4b78-a76a-799b9cdfdfb1
637	3	592a25ef4dad8f945b70aaca4ab155783324914949d64cdc2ba7f6dc457a49fd	2026-11-16 03:38:30.403	2026-11-09 03:42:27.206	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 03:38:30.438268	819f4921-e1bb-4a2f-a5c6-04e9bc54f7d2
638	5	a475cb2eb4972c2e3a1b9b6fc6058826164b7df2d9523ea09f2ae5f1a6236cf5	2026-11-16 03:42:39.276	2026-11-09 03:57:45.108	639	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 03:42:39.29547	ab614a2c-3829-486e-ab25-4316b2b23023
639	5	8873ec895a2bbd6efed3435303c29d7a918d3496537e933d602e22bf39bbff77	2026-11-16 03:57:45.081	2026-11-09 03:59:40.054	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 03:57:45.104243	ab614a2c-3829-486e-ab25-4316b2b23023
641	4	779b5099ea9c1e1da0a9fbd4c89ebafc01eb1ebd2553286d062ff755d4e36e43	2026-11-16 04:13:35.774	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-09 04:13:35.810344	2067123a-1eac-41b4-982d-e971ff30b415
640	3	75172bbee450eabe80c7dca5d56a8e3932c0253d6a85899f2233c66f89a88944	2026-11-16 03:59:46.375	2026-11-09 04:15:12.463	642	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 03:59:46.402059	6a882f0c-4aef-4635-8274-157377f69e35
632	4	7ea2fa229cc96622870174482ca8cf6e8d1363fff5e5b12162390a38448f7184	2026-11-15 21:42:48.356	2026-11-09 04:13:43.888	641	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-08 21:42:48.37078	2067123a-1eac-41b4-982d-e971ff30b415
642	3	388fbe12b844e01507234a2028b98be82d21f6402655d173c1ca0cf8c03c4564	2026-11-16 04:15:12.44	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 04:15:12.460541	6a882f0c-4aef-4635-8274-157377f69e35
643	3	8ab8fa5c6899273e8dccdae0c75345547cbd340d01ce79e1d5c27e46b3ccfa21	2026-11-16 04:16:54.937	2026-11-09 04:31:06.493	644	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 04:16:54.967883	99d97154-a80b-44da-b2fe-90c483efae0f
644	3	5d6a33e5fcacafc83605ce67813426b8aa0c36aac8fdb79ff6ffbada478d82cc	2026-11-16 04:31:06.471	2026-11-09 04:37:04.325	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 04:31:06.490909	99d97154-a80b-44da-b2fe-90c483efae0f
645	3	6006ae011a9eb1c79ef84036ec974116214a68cbc48e3d31de1a7c687afb899c	2026-11-16 04:37:29.753	2026-11-09 04:38:06.523	646	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 04:37:29.779237	d61bf54d-63a1-4884-b6fd-7c8d2bbd6976
646	3	cd77e5b78f2073f9860119f462713878c6f1b1ed9fc292d6f2f8ccc4839cbfe3	2026-11-16 04:38:06.507	2026-11-09 04:53:06.53	647	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 04:38:06.520068	d61bf54d-63a1-4884-b6fd-7c8d2bbd6976
647	3	9cd47029142136bcd17fe8bd89e4f2056a200968e391d538ccaf0e58476c448a	2026-11-16 04:53:06.513	2026-11-09 05:08:06.581	648	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 04:53:06.526279	d61bf54d-63a1-4884-b6fd-7c8d2bbd6976
649	3	2ad2b0a8c1e7f5ff15ee17e096444de6f0a9549c70aec3b850aa6b89deb5f681	2026-11-16 05:23:06.552	2026-11-09 05:34:33.407	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 05:23:06.566997	d61bf54d-63a1-4884-b6fd-7c8d2bbd6976
648	3	b54d28a32e86243e4fd309bd398b709790ff9b72f4c0cde94b6627d9f7ee7bb3	2026-11-16 05:08:06.552	2026-11-09 05:23:06.573	649	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 05:08:06.577142	d61bf54d-63a1-4884-b6fd-7c8d2bbd6976
650	3	0678b52ab562c6527ceccdd30b4b0e2647638900a170a0e1bed69e7210c9a0c8	2026-11-16 05:34:48.49	2026-11-09 05:36:49.334	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 05:34:48.516557	9e8485a7-9a73-4b43-9138-96c9bb683728
651	3	3413afce8de68cfecf92df2de8bd3dbc992b8b2562b291f99ed2e74b5c2f0200	2026-11-16 05:36:54.445	2026-11-09 05:52:11.577	652	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 05:36:54.474121	27e6df72-aa57-4402-ace8-2c2ba9c39c34
652	3	6c8876dd75e51126ee7909ee97078b7a447bddc06700d5b8d66d58cb57ae80c0	2026-11-16 05:52:11.564	2026-11-09 06:08:06.592	653	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 05:52:11.57889	27e6df72-aa57-4402-ace8-2c2ba9c39c34
653	3	594b8a40ca8edb1abc6703d1115fc98ca458dea04a2dc351ca1e7b133ac10c44	2026-11-16 06:08:06.575	2026-11-09 06:23:33.671	654	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 06:08:06.588743	27e6df72-aa57-4402-ace8-2c2ba9c39c34
655	4	d7be90cfda99bfad3251426cbcd9853eb0bd76155fa4c67b6f15ea768fd11755	2026-11-16 06:31:18.581	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	127.0.0.1	2026-11-09 06:31:18.599799	22436a9a-75ee-45a1-9ef2-6b81b5fb20a4
654	3	6252d02f18d8ffc2d3afae3c729fc04ed75bb8453bea1b66a1b1e7c57def2b01	2026-11-16 06:23:33.623	2026-11-09 06:39:06.61	656	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 06:23:33.666522	27e6df72-aa57-4402-ace8-2c2ba9c39c34
656	3	19e33859f5d95a92ff1659d0ba1a289863143965c4fedac4a2947eb6be8d6013	2026-11-16 06:39:06.596	2026-11-09 06:39:52.03	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 06:39:06.608064	27e6df72-aa57-4402-ace8-2c2ba9c39c34
657	20	58e18c45d0fc84d9b7e59c1c16b085f6e272772f83e5bd15cb21b4c6b52f980f	2026-11-16 06:39:57.254	2026-11-09 06:55:06.643	658	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 06:39:57.282819	f477e606-d2d3-4f75-bfc0-dd41f774c2a2
658	20	c6b659aa07c455750c447082bc1147606537bcd30e1c9f37fc5c3816fd521ac1	2026-11-16 06:55:06.611	2026-11-09 07:10:06.641	659	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 06:55:06.639833	f477e606-d2d3-4f75-bfc0-dd41f774c2a2
659	20	c7bb98d4a864de260612a18d2e34eabf9f75e16dd3fcc3e5107c8116b2c787e9	2026-11-16 07:10:06.621	2026-11-09 07:25:06.611	660	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 07:10:06.63971	f477e606-d2d3-4f75-bfc0-dd41f774c2a2
660	20	f7055d1d4e15276d45a7f5d1face023cd10c07941c7043d2e375c5e7c5653cef	2026-11-16 07:25:06.596	2026-11-09 07:40:06.623	661	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 07:25:06.608384	f477e606-d2d3-4f75-bfc0-dd41f774c2a2
661	20	a76c110543e7d42931b949ff8b6a6335902ad9a6b0c10215ff4b95dc6418ce74	2026-11-16 07:40:06.606	2026-11-09 07:55:06.638	662	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 07:40:06.620927	f477e606-d2d3-4f75-bfc0-dd41f774c2a2
662	20	669dbcddd404016ac217adec0e0fcbab37004f5caf6dbe61eacbe566bafd4473	2026-11-16 07:55:06.618	2026-11-09 08:10:06.627	663	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 07:55:06.634873	f477e606-d2d3-4f75-bfc0-dd41f774c2a2
663	20	004a9d8ac012998c743b056625f706a936699cd59a768498571f3037b7823ead	2026-11-16 08:10:06.597	2026-11-09 08:25:06.611	664	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 08:10:06.622875	f477e606-d2d3-4f75-bfc0-dd41f774c2a2
664	20	f56600cd6f1ec9d5e46ea65234a83bfff6319324a7970e15cb099941344edfcd	2026-11-16 08:25:06.598	2026-11-09 08:40:06.594	665	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 08:25:06.60785	f477e606-d2d3-4f75-bfc0-dd41f774c2a2
665	20	11235805541bbdaf6e33a93554d261f2e7cb3448b60c91728f846b72833233bb	2026-11-16 08:40:06.583	2026-11-09 10:13:45.25	666	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 08:40:06.59213	f477e606-d2d3-4f75-bfc0-dd41f774c2a2
666	20	bed8fb225047bcd8bc66e80c286b3a2b6d317866abf9409b8bc360644b678993	2026-11-16 10:13:45.096	2026-11-09 10:13:49.308	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 10:13:45.215897	f477e606-d2d3-4f75-bfc0-dd41f774c2a2
667	20	3c121a88149e47cb3797275803216ba7375da8899df9b239e27f25739224fa1b	2026-11-16 10:13:53.398	2026-11-09 10:29:07.128	668	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 10:13:53.41415	181ba091-0828-4a00-b31c-06d889bf4de7
669	20	078f896eb690647dd6b00e5df5306dccceb0c72d6e3cf04361c47a5099e4ecc8	2026-11-16 10:44:07.091	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 10:44:07.117779	181ba091-0828-4a00-b31c-06d889bf4de7
668	20	3a3671a0c586f2ca1f902e868503d381e0be77c27180d510d3ae1498d709cc4c	2026-11-16 10:29:07.103	2026-11-09 10:44:07.115	669	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	127.0.0.1	2026-11-09 10:29:07.124686	181ba091-0828-4a00-b31c-06d889bf4de7
\.


--
-- TOC entry 3641 (class 0 OID 16400)
-- Dependencies: 216
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role (actif, code, created_at, description, libelle, id) FROM stdin;
t	ADMIN	2026-08-24 12:44:03.674447	AccŠs total	Administrateur	1
t	CONTROLEUR	2026-08-26 19:04:47.106601	Gestionnaire des fiches de chargement sur mobile	Contr“leur de Gare	2
t	AGENT	2026-08-27 15:04:35.042205	Agent charg‚ des op‚rations courantes	Agent	6
t	RESPONSABLE_GARE	2026-08-27 15:05:20.300591	Responsable de la gestion d'une gare	Responsable de gare	7
t	AUTORITE_HABILITEE	2026-08-27 15:06:01.03505	Autorit‚ disposant de droits de contr“le	Autorit‚ habilit‚e	8
\.


--
-- TOC entry 3664 (class 0 OID 41674)
-- Dependencies: 239
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, utilisateur_id, gare_id, device_type, device_name, last_seen_at, connected_at, expires_at, revoked_at) FROM stdin;
00b6412f-c4a8-4186-a237-602c94d73db6	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 23:22:57.206-05	2026-11-06 23:20:51.426-05	2026-11-13 23:20:51.426-05	2026-11-06 23:23:00.278-05
e33c102e-46a8-4660-b7a1-300faf5923ff	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:31:13.45-05	2026-11-06 22:23:03.331-05	2026-11-13 22:23:03.331-05	2026-11-06 22:31:16.152-05
2aade671-5975-4080-8b1a-33bc7e36ae35	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	2026-11-07 02:22:07.263-05	2026-11-07 00:12:00.194-05	2026-11-14 02:22:07.256-05	\N
9971ecf8-1e57-4715-a45d-0a4e5f2d1b8c	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:54:50.157-05	2026-11-06 22:49:29.084-05	2026-11-13 22:49:29.084-05	2026-11-06 22:54:59.069-05
31009ea0-14e6-42fc-b08a-05f92a15fca2	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 23:24:12.581-05	2026-11-06 23:24:12.276-05	2026-11-13 23:24:12.276-05	2026-11-06 23:24:16.528-05
c4733f17-58a3-437e-815e-a1b4d775fbbf	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:55:08.995-05	2026-11-06 22:55:08.201-05	2026-11-13 22:55:08.201-05	2026-11-06 22:55:31.738-05
37c68923-776e-4bc9-87b6-849f24409c3a	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 19:47:15.901-05	2026-11-06 19:19:32.749-05	2026-11-13 19:45:55.343-05	2026-11-06 19:47:18.553-05
076a8364-d061-437f-9426-a042e2b331ae	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:42:49.102-05	2026-11-06 22:41:18.183-05	2026-11-13 22:41:18.183-05	2026-11-06 22:42:57.908-05
7733324b-c86d-448f-ad67-5f9009cbf443	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:34:39.592-05	2026-11-06 22:31:33.474-05	2026-11-13 22:31:33.474-05	2026-11-06 22:34:42.331-05
51cf3871-f285-48d1-af08-fa5a3b7b2711	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-07 00:18:16.317-05	2026-11-06 23:54:24.192-05	2026-11-14 00:10:04.1-05	2026-11-07 00:18:19.137-05
4f25c6a7-3a3c-4cf6-b3e9-5d6b30411c72	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 23:26:32.691-05	2026-11-06 23:24:33.703-05	2026-11-13 23:24:33.703-05	2026-11-06 23:26:35.288-05
98f9de67-3560-4fcb-b7b6-8a00d30de6c8	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:58:10.088-05	2026-11-06 22:55:38.796-05	2026-11-13 22:55:38.796-05	2026-11-06 22:58:20.503-05
fb2b98f0-da61-4d42-a2b5-7d7f95b00261	2	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-07 01:49:49.039-05	2026-11-07 00:18:27.734-05	2026-11-14 01:49:48.895-05	2026-11-07 01:49:51.868-05
8d45fbe7-0e4d-49ee-8dfd-1b826b81893b	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 23:30:04.101-05	2026-11-06 23:26:42.261-05	2026-11-13 23:26:42.261-05	2026-11-06 23:30:07.683-05
a196c5db-c709-4ccb-a9a1-0270f1fc6751	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:15:35.269-05	2026-11-06 20:46:06.126-05	2026-11-13 22:15:35.242-05	2026-11-06 22:15:37.583-05
03e350ea-e01f-4888-9f8f-9842947438d4	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:45:08.047-05	2026-11-06 22:43:00.843-05	2026-11-13 22:43:00.843-05	2026-11-06 22:45:20.545-05
d094706f-8967-4966-9b2d-ecd0f234c3d7	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:15:40.899-05	2026-11-06 22:15:40.627-05	2026-11-13 22:15:40.627-05	2026-11-06 22:15:46.781-05
85fa98e4-5cd1-46db-8f4e-3a3251a8e863	4	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	2026-11-06 20:08:45.457-05	2026-11-06 20:08:45.386-05	2026-11-13 20:08:45.386-05	2026-11-06 20:09:07.523-05
b7fac4d8-1714-47f0-a84f-4bc18d847e71	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 20:46:02.174-05	2026-11-06 19:47:19.787-05	2026-11-13 20:35:04.105-05	2026-11-06 20:46:03.984-05
e6ce1c69-61c4-4b98-b34c-e27977bcde8d	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:15:51.057-05	2026-11-06 22:15:50.792-05	2026-11-13 22:15:50.792-05	2026-11-06 22:16:19.932-05
1f173a25-7c99-42cf-9197-1a3c15d72b55	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:45:40.298-05	2026-11-06 22:45:22.601-05	2026-11-13 22:45:22.601-05	2026-11-06 22:45:43.547-05
322a88ab-2bf1-42a0-9368-1689e16cf638	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:45:46.054-05	2026-11-06 22:45:45.746-05	2026-11-13 22:45:45.746-05	2026-11-06 22:45:58.141-05
582a6567-6da3-4e63-b334-6b9d96e2d329	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:19:36.333-05	2026-11-06 22:19:13.147-05	2026-11-13 22:19:13.147-05	2026-11-06 22:19:41.85-05
b25f9199-035f-49fe-9c84-28c23f11aeaf	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:46:07.982-05	2026-11-06 22:46:07.698-05	2026-11-13 22:46:07.698-05	2026-11-06 22:46:11.503-05
79527953-3577-49e1-b882-b55b9751b77d	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:39:25.269-05	2026-11-06 22:34:47.673-05	2026-11-13 22:34:47.673-05	2026-11-06 22:39:28.061-05
27bfddfd-aeea-43cc-b9a7-c86602820be2	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:46:16.483-05	2026-11-06 22:46:16.208-05	2026-11-13 22:46:16.208-05	2026-11-06 22:46:20.217-05
7976785b-6622-4a89-aaf7-bccc85bff26d	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 23:06:57.46-05	2026-11-06 22:59:29.879-05	2026-11-13 22:59:29.879-05	2026-11-06 23:07:01.244-05
9cd92359-be4f-43d8-8da6-b8fa05213fd8	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:48:39.536-05	2026-11-06 22:48:39.061-05	2026-11-13 22:48:39.061-05	2026-11-06 22:48:44.614-05
2207c701-49e0-49ee-b875-b9fcf3573fb7	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:39:50.746-05	2026-11-06 22:39:32.133-05	2026-11-13 22:39:32.133-05	2026-11-06 22:40:10.311-05
2139f34a-f089-4b0b-8b2f-ccbee27ea893	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:48:48.924-05	2026-11-06 22:48:48.657-05	2026-11-13 22:48:48.657-05	2026-11-06 22:49:04.701-05
c1e50693-51fd-437e-b6c5-6f18d250d9dd	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:40:13.676-05	2026-11-06 22:40:13.416-05	2026-11-13 22:40:13.416-05	2026-11-06 22:40:32.336-05
06f48dae-8922-4c95-b160-5a6a39d2c3ee	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-07 02:04:04.088-05	2026-11-07 01:50:00.431-05	2026-11-14 01:50:00.431-05	\N
2f827dec-737d-44fd-bc9c-edceb6aac821	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 22:40:48.625-05	2026-11-06 22:40:36.422-05	2026-11-13 22:40:36.422-05	2026-11-06 22:40:51.777-05
e00bb1b7-7bed-449d-9d49-5cdeaa49eb00	4	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	2026-11-07 00:10:59.799-05	2026-11-06 22:35:29.292-05	2026-11-14 00:10:59.793-05	2026-11-07 00:11:27.445-05
c2ac5e6a-022a-4aaf-8c47-64b8668f4ce4	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 23:19:44.08-05	2026-11-06 23:16:32.168-05	2026-11-13 23:16:32.168-05	2026-11-06 23:19:47.975-05
2130f217-e8c0-4c32-a31a-a2586e8faf05	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-06 23:54:04.346-05	2026-11-06 23:32:27.92-05	2026-11-13 23:48:04.098-05	2026-11-06 23:54:12.17-05
7fda9c52-bd50-42f3-bb6c-0491f2587dcc	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	2026-11-08 17:24:21.605-05	2026-11-07 20:41:58.165-05	2026-11-15 17:24:21.588-05	2026-11-08 17:24:26.945-05
59c00b66-5eec-4875-8c53-adbdaaab2fd1	2	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 15:01:27.997-05	2026-11-08 15:00:34.014-05	2026-11-15 15:00:34.014-05	2026-11-08 15:01:57.567-05
d3ebc9f0-3ab5-4d57-81d1-4dbfc13fea86	5	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 15:03:05.603-05	2026-11-08 15:02:05.248-05	2026-11-15 15:02:05.248-05	2026-11-08 15:03:33.771-05
975ec4b2-6604-45bc-9598-5a2aea8f4ab5	2	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 15:05:13.448-05	2026-11-08 15:04:13.11-05	2026-11-15 15:04:13.11-05	2026-11-08 15:05:15.724-05
0e5fc744-574d-40f3-91b1-261223af02c4	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-07 02:06:45.032-05	2026-11-07 01:51:20.055-05	2026-11-14 02:05:04.11-05	2026-11-07 02:06:51.294-05
d99bd27a-01bc-43d1-8106-0c94ea72e565	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 08:43:57.023-05	2026-11-08 07:46:28.837-05	2026-11-15 08:32:06.317-05	2026-11-08 08:44:00.762-05
cc9a694c-d954-4dcc-ac7a-48d91b9c5ef3	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	2026-11-07 02:15:40.329-05	2026-11-07 02:05:11.477-05	2026-11-14 02:05:11.477-05	\N
db286fec-ffd8-4bcc-85aa-84366013362c	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36	2026-11-08 18:54:43.365-05	2026-11-07 02:19:00.309-05	2026-11-15 18:45:13.973-05	\N
fdae4243-f305-4557-ae80-434dade59fcd	4	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-07 02:19:42.97-05	2026-11-07 02:07:52.362-05	2026-11-14 02:07:52.362-05	2026-11-07 02:19:45.229-05
9c1b92a4-9345-4027-85fd-0d80fe060fc5	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-07 02:07:35.566-05	2026-11-07 02:07:01.339-05	2026-11-14 02:07:01.339-05	2026-11-07 02:07:41.132-05
52d4c0cd-a74b-4b58-bd97-0735b07e2f49	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 14:38:06.296-05	2026-11-08 14:21:09.893-05	2026-11-15 14:36:37.3-05	2026-11-08 14:38:24.237-05
564c6ebf-063f-40b9-959d-ab9eeecfa6f6	4	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-07 02:07:48.522-05	2026-11-07 02:07:48.522-05	2026-11-14 02:07:48.522-05	\N
17a674b3-f836-456b-8f39-acdd4392ea03	4	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-07 02:07:50.692-05	2026-11-07 02:07:50.692-05	2026-11-14 02:07:50.692-05	\N
b30ae0bb-fbce-4111-a1a0-117dea17d988	4	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-07 02:07:51.6-05	2026-11-07 02:07:51.6-05	2026-11-14 02:07:51.6-05	\N
1fabff85-705b-4eab-b249-2abeb8a2eff2	4	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-07 02:07:52.128-05	2026-11-07 02:07:52.128-05	2026-11-14 02:07:52.128-05	\N
65607827-de2a-4b5f-88a2-db923947e7ed	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 14:42:28.344-05	2026-11-08 14:42:28.067-05	2026-11-15 14:42:28.067-05	2026-11-08 14:42:32.797-05
790680f2-edf8-4613-952a-a9df41b6f25e	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 15:06:55.435-05	2026-11-08 15:05:25.116-05	2026-11-15 15:05:25.116-05	2026-11-08 15:06:56.117-05
7ea893cc-4892-448f-bb6f-f622399b98ba	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 08:45:56.643-05	2026-11-08 08:44:12.059-05	2026-11-15 08:44:12.059-05	2026-11-08 08:45:59.43-05
8dacbb54-34d9-4f99-b34d-5dffd25dd4ab	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 14:42:54.006-05	2026-11-08 14:42:53.744-05	2026-11-15 14:42:53.744-05	2026-11-08 14:42:56.657-05
833c00d5-6b1a-463a-bac3-6385140cecf9	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 08:46:27.746-05	2026-11-08 08:46:02.733-05	2026-11-15 08:46:02.733-05	2026-11-08 08:46:30.642-05
13d02349-0b9e-4b82-a0da-af3aa4e4fdd2	4	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 14:49:20.283-05	2026-11-08 14:47:50.936-05	2026-11-15 14:47:50.936-05	2026-11-08 14:49:35.009-05
cc78a120-4f92-4983-a8f3-fb352075b1c7	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 14:16:31.249-05	2026-11-08 13:45:17.924-05	2026-11-15 14:15:36.378-05	2026-11-08 14:16:31.267-05
de965541-8303-4c46-b13d-40162a53bb1e	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	2026-11-07 20:41:07.905-05	2026-11-07 20:11:21.668-05	2026-11-14 20:27:05.616-05	2026-11-07 20:41:11.827-05
192b3f64-8178-4548-9c40-83d7fb468357	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 14:17:01.76-05	2026-11-08 14:17:01.369-05	2026-11-15 14:17:01.369-05	2026-11-08 14:17:04.7-05
b920c6dc-be00-4e33-9c19-3877b05a02b2	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 15:15:04.987-05	2026-11-08 15:07:51.267-05	2026-11-15 15:07:51.267-05	2026-11-08 15:15:12.577-05
458c7e08-3902-43ca-bf3d-cf03c6640ed4	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	2026-11-07 20:11:14.165-05	2026-11-07 12:37:20.519-05	2026-11-14 20:11:14.163-05	\N
4e072ba5-0d17-4383-a509-47e0f9f09a24	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 13:44:29.614-05	2026-11-08 08:46:35.066-05	2026-11-15 13:31:06.299-05	2026-11-08 13:44:29.714-05
950d6fa0-698f-41e5-a141-6235454e26f4	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	2026-11-07 12:37:05.978-05	2026-11-07 12:26:26.902-05	2026-11-14 12:26:26.902-05	2026-11-07 12:37:16.443-05
7e4a433a-5a52-4f42-b41e-ae68b60e7a05	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 16:47:47.446-05	2026-11-08 15:32:38.906-05	2026-11-15 16:33:10.855-05	\N
8175ef1b-e611-41d0-92b8-3b64cf244841	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 07:46:13.036-05	2026-11-07 02:20:15.521-05	2026-11-15 07:32:06.323-05	2026-11-08 07:46:20.139-05
2f474add-93bb-44eb-abee-d30a78c2622d	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	2026-11-07 12:20:55.887-05	2026-11-07 02:22:15.373-05	2026-11-14 12:20:55.878-05	2026-11-07 12:26:22.359-05
091ec890-4774-4d9c-9791-c02fdb1b6b3c	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 14:54:13.291-05	2026-11-08 14:49:40.768-05	2026-11-15 14:49:40.768-05	2026-11-08 14:54:40.37-05
c9610565-78a3-4138-841e-3e7259b3ce57	11	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 15:18:35.405-05	2026-11-08 15:16:08.093-05	2026-11-15 15:16:08.093-05	2026-11-08 15:18:40.458-05
63b2244d-1c96-4930-9e18-3708249abd8c	4	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 15:00:20.29-05	2026-11-08 14:54:49.98-05	2026-11-15 14:54:49.98-05	2026-11-08 15:00:26.185-05
0239d857-9766-4d1f-bc97-a27c95520ead	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 15:32:33.216-05	2026-11-08 15:18:46.107-05	2026-11-15 15:18:46.107-05	2026-11-08 15:32:34.952-05
d2fd222d-cc38-418b-8757-d4bfd57bb6d0	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 16:48:18.413-05	2026-11-08 16:45:55.865-05	2026-11-15 16:48:17.88-05	2026-11-08 16:48:39.214-05
7a6b301a-326c-436e-9ff4-a670891b4195	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 17:52:24.64-05	2026-11-08 17:25:28.654-05	2026-11-15 17:40:40.348-05	2026-11-08 17:52:28.537-05
6a882f0c-4aef-4635-8274-157377f69e35	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-09 04:30:06.445-05	2026-11-09 03:59:46.377-05	2026-11-16 04:15:12.44-05	\N
3e8d4ac3-8901-48bb-a3c1-2a2273f3107f	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 16:53:43.328-05	2026-11-08 16:48:47.336-05	2026-11-15 16:48:47.336-05	2026-11-08 16:53:47.305-05
99d97154-a80b-44da-b2fe-90c483efae0f	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-09 04:36:06.472-05	2026-11-09 04:16:54.939-05	2026-11-16 04:31:06.471-05	2026-11-09 04:37:04.344-05
181ba091-0828-4a00-b31c-06d889bf4de7	20	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-09 10:57:07.089-05	2026-11-09 10:13:53.4-05	2026-11-16 10:44:07.091-05	\N
ab614a2c-3829-486e-ab25-4316b2b23023	5	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-09 03:59:15.073-05	2026-11-09 03:42:39.277-05	2026-11-16 03:57:45.081-05	2026-11-09 03:59:40.083-05
34ac1423-652d-4ff5-bb45-186cf06d4946	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 18:03:06.198-05	2026-11-08 17:52:31.89-05	2026-11-15 17:52:31.89-05	2026-11-08 18:03:16.681-05
3c398f5d-39bc-43fa-9947-1177335b80c4	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 16:57:45.689-05	2026-11-08 16:53:51.049-05	2026-11-15 16:53:51.049-05	2026-11-08 16:58:02.582-05
e83ecf6e-d459-4c0c-9006-8b6d08657690	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-09 03:20:51.767-05	2026-11-08 21:18:48.804-05	2026-11-16 03:20:51.755-05	2026-11-09 03:25:06.238-05
6f0e8189-3502-4b78-a76a-799b9cdfdfb1	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-09 03:31:17.146-05	2026-11-09 03:31:16.821-05	2026-11-16 03:31:16.821-05	2026-11-09 03:31:33.841-05
3f3fac2f-05b3-494b-9ab1-963c256d4383	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-09 03:33:47.422-05	2026-11-09 03:33:47.14-05	2026-11-16 03:33:47.14-05	2026-11-09 03:33:57.095-05
67c34929-4a93-4bd5-98b1-515597885871	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 18:20:07.455-05	2026-11-08 18:04:20.37-05	2026-11-15 18:20:06.882-05	2026-11-08 18:20:18.135-05
2067123a-1eac-41b4-982d-e971ff30b415	4	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	2026-11-09 04:13:35.789-05	2026-11-08 21:42:48.358-05	2026-11-16 04:13:35.774-05	2026-11-09 04:13:43.904-05
819f4921-e1bb-4a2f-a5c6-04e9bc54f7d2	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-09 03:42:18.67-05	2026-11-09 03:38:30.405-05	2026-11-16 03:38:30.405-05	2026-11-09 03:42:27.223-05
bd516357-cd5a-40c7-801d-c69df0ba3375	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 21:17:35.6-05	2026-11-08 19:50:57.27-05	2026-11-15 21:06:53.503-05	2026-11-08 21:17:51.607-05
27e6df72-aa57-4402-ace8-2c2ba9c39c34	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-09 06:39:06.625-05	2026-11-09 05:36:54.448-05	2026-11-16 06:39:06.596-05	2026-11-09 06:39:52.062-05
67ee7293-c534-456d-80bb-0539dc7c70d1	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 19:50:22.039-05	2026-11-08 18:21:28.753-05	2026-11-15 19:50:15.932-05	2026-11-08 19:50:28.982-05
62c1e177-3e3b-4abf-819b-e34a2afe1472	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 19:50:44.335-05	2026-11-08 19:50:39.318-05	2026-11-15 19:50:39.318-05	2026-11-08 19:50:52.047-05
97089b51-d2ea-4936-9ef1-4265ddd6c69b	4	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-08 21:18:16.346-05	2026-11-08 21:17:58.848-05	2026-11-15 21:17:58.848-05	2026-11-08 21:18:40.92-05
d61bf54d-63a1-4884-b6fd-7c8d2bbd6976	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-09 05:34:26.543-05	2026-11-09 04:37:29.754-05	2026-11-16 05:23:06.552-05	2026-11-09 05:34:33.414-05
f477e606-d2d3-4f75-bfc0-dd41f774c2a2	20	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-09 10:13:45.385-05	2026-11-09 06:39:57.256-05	2026-11-16 10:13:45.096-05	2026-11-09 10:13:49.329-05
56495c66-ebcc-4af7-82df-f6aa885f4b92	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	2026-11-08 18:26:21.827-05	2026-11-08 17:24:30.364-05	2026-11-15 18:26:21.817-05	2026-11-08 21:42:41.204-05
9e8485a7-9a73-4b43-9138-96c9bb683728	3	b85b7387-decd-4626-abac-80e70d08bbda	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36	2026-11-09 05:35:59.422-05	2026-11-09 05:34:48.491-05	2026-11-16 05:34:48.491-05	2026-11-09 05:36:49.364-05
22436a9a-75ee-45a1-9ef2-6b81b5fb20a4	4	d3b94ae9-279e-43c1-81d7-67d6960734a9	WEB	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36 Edg/156.0.0.0	2026-11-09 06:46:06.737-05	2026-11-09 06:31:18.583-05	2026-11-16 06:31:18.583-05	\N
\.


--
-- TOC entry 3653 (class 0 OID 16659)
-- Dependencies: 228
-- Data for Name: sync_queue; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sync_queue (id, entity_type, entity_id, operation, payload, status, retry_count, created_at, last_attempt_at, last_error) FROM stdin;
\.


--
-- TOC entry 3642 (class 0 OID 16408)
-- Dependencies: 217
-- Data for Name: utilisateur; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateur (actif, bloque, created_at, email, last_login_at, nom, password_hash, prenom, telephone, updated_at, username, id, gare_id, role_id) FROM stdin;
t	f	2026-09-11 15:45:33.834643	autorite1@gare.com	2026-11-09 03:42:39.303	AUTORITE_HABILITE	$2b$10$7EYBJFxWfszGGFGi6gHL/.QLXPtyBIsg5hLD0gu5AB9hfCRGk3Wjm	Test	\N	2026-11-09 03:42:39.306651	autorite1	5	d3b94ae9-279e-43c1-81d7-67d6960734a9	8
t	f	2026-11-09 04:01:21.847867	Tchoukioarmand@test.ca	\N	Tchoukio	$2b$10$0H.1ie5Mt2RhxFwPgLhCl.4i1n0skZmEhdaMEeKs/.HIEu9C0kZOq	armand	5149854532	2026-11-09 05:17:49.838379	Tchoukio	14	b85b7387-decd-4626-abac-80e70d08bbda	1
t	f	2026-09-25 03:39:17.836736	responsable1@gare.com	2026-11-08 15:16:08.116	Responsable	$2b$10$zHUa8GFicwFWpqFsQjnemeI0NFWsX6MMMBFzgJQAPlNvxneag/auC	Gare	\N	2026-11-08 15:16:08.117954	responsable1	11	d3b94ae9-279e-43c1-81d7-67d6960734a9	7
t	f	2026-08-26 19:06:48.180316	jean.kameni@gare.com	2026-11-08 15:04:13.122	Kameni kwe	$2b$10$nMaPWZEtxu0aR66bj4Bcw.mG8og5dIhpa3QE9yhaxVkx6EBIvtLNC	Jean	+243810000001	2026-11-09 05:27:13.796523	controleur1	2	d3b94ae9-279e-43c1-81d7-67d6960734a9	2
t	f	2026-09-11 15:11:44.183937	admin2@gare.com	2026-11-09 05:36:54.469	Administrateur	$2b$10$LaDjxk.z2/VLNzIHSaGfOuE4vzYzyD1KPYsnWVEH6bVVks9TTgp3G	Test	\N	2026-11-09 05:36:54.479369	admin2	3	b85b7387-decd-4626-abac-80e70d08bbda	1
t	f	2026-09-11 15:30:38.609346	agent1@gare.com	2026-11-09 06:31:18.605	Agent	$2b$10$/pPQB0s4mQRfVnYuXRQ9cuyWMbgh72UotnLYd.bEKcEuZnKqFzRsa	Test	56987/1452	2026-11-09 06:31:18.609473	agent1	4	d3b94ae9-279e-43c1-81d7-67d6960734a9	6
t	f	2026-11-09 05:46:30.88475	bilschool@outlook.com	2026-11-09 10:13:53.417	biloloo ngue	$2b$10$y6ypxhd4lP5Ufxwz6m8wXOyRJtyIXMgvV/8HhlrNfnB7yMg.CxSI2	samuel	14389248545	2026-11-09 10:13:53.420665	bilschool@outlook.com	20	b85b7387-decd-4626-abac-80e70d08bbda	2
\.


--
-- TOC entry 3646 (class 0 OID 16507)
-- Dependencies: 221
-- Data for Name: vehicule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicule (id, plaque_immatriculation, type, marque, modele, capacite, statut, created_at, updated_at, proprietaire_id, gare_id) FROM stdin;
30cac1dc-f6ca-4f56-b811-50a78685b5cc	CE-1234-AA	BUS	Toyota	Coaster	30	ACTIF	2026-09-29 04:53:19.24369	2026-09-29 04:53:19.24369	bfb47b50-6000-42c8-8220-8985ae27f12f	b85b7387-decd-4626-abac-80e70d08bbda
5530fb55-d0d4-4c74-8772-d7867c458de3	CE-1235-AA	LIMOSINE	FORD	EDGE	12	ACTIF	2026-09-30 09:07:50.364996	2026-09-30 09:07:50.364996	bfb47b50-6000-42c8-8220-8985ae27f12f	b85b7387-decd-4626-abac-80e70d08bbda
1916db58-bdf4-4988-83d3-eb5e187b3ea8	CE-1834-AB	MINI BUS	MERCEDES	GROOVE	12	ACTIF	2026-09-30 09:10:16.38828	2026-09-30 09:10:16.38828	bfb47b50-6000-42c8-8220-8985ae27f12f	b85b7387-decd-4626-abac-80e70d08bbda
505c1322-b981-4717-a11a-405a30051b95	CE-12310-AA	AUTOBUS	Ford	Edge	22	ACTIF	2026-10-31 21:17:21.719311	2026-10-31 21:17:21.719311	bfb47b50-6000-42c8-8220-8985ae27f12f	d3b94ae9-279e-43c1-81d7-67d6960734a9
18273fbf-b423-4dc0-a151-a1e4ca2e96fb	LT-12548	MINI CAR	Toyota	Sprinter	12	ACTIF	2026-09-29 09:24:17.574368	2026-11-01 19:40:02.011562	bfb47b50-6000-42c8-8220-8985ae27f12f	b85b7387-decd-4626-abac-80e70d08bbda
c473cf16-d002-451c-a53c-aa870211fa2f	LT-12548-DF	BERLINE	SUBARU	OUTBACK	6	ACTIF	2026-11-01 21:06:17.756032	2026-11-01 21:06:17.756032	77ccafa1-b405-4ced-9094-7a276a45ae43	b85b7387-decd-4626-abac-80e70d08bbda
\.


--
-- TOC entry 3675 (class 0 OID 0)
-- Dependencies: 238
-- Name: bordereau_route_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bordereau_route_seq', 8, true);


--
-- TOC entry 3676 (class 0 OID 0)
-- Dependencies: 233
-- Name: refresh_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.refresh_token_id_seq', 669, true);


--
-- TOC entry 3677 (class 0 OID 0)
-- Dependencies: 218
-- Name: role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_id_seq', 8, true);


--
-- TOC entry 3678 (class 0 OID 0)
-- Dependencies: 219
-- Name: utilisateur_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilisateur_id_seq', 20, true);


--
-- TOC entry 3382 (class 2606 OID 16448)
-- Name: utilisateur PK_838f0f99fe900e49ef050030443; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT "PK_838f0f99fe900e49ef050030443" PRIMARY KEY (id);


--
-- TOC entry 3378 (class 2606 OID 16435)
-- Name: role PK_b36bcfe02fc8de3c57a8b2391c2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY (id);


--
-- TOC entry 3445 (class 2606 OID 16789)
-- Name: alerte_document alerte_document_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerte_document
    ADD CONSTRAINT alerte_document_pkey PRIMARY KEY (id);


--
-- TOC entry 3441 (class 2606 OID 16775)
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- TOC entry 3404 (class 2606 OID 16541)
-- Name: chauffeur chauffeur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chauffeur
    ADD CONSTRAINT chauffeur_pkey PRIMARY KEY (id);


--
-- TOC entry 3411 (class 2606 OID 16567)
-- Name: destination destination_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.destination
    ADD CONSTRAINT destination_code_key UNIQUE (code);


--
-- TOC entry 3413 (class 2606 OID 16565)
-- Name: destination destination_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.destination
    ADD CONSTRAINT destination_pkey PRIMARY KEY (id);


--
-- TOC entry 3407 (class 2606 OID 16552)
-- Name: document_chauffeur document_chauffeur_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_chauffeur
    ADD CONSTRAINT document_chauffeur_pkey PRIMARY KEY (id);


--
-- TOC entry 3400 (class 2606 OID 16528)
-- Name: document_vehicule document_vehicule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_vehicule
    ADD CONSTRAINT document_vehicule_pkey PRIMARY KEY (id);


--
-- TOC entry 3462 (class 2606 OID 16902)
-- Name: fiche_impression fiche_impression_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_impression
    ADD CONSTRAINT fiche_impression_pkey PRIMARY KEY (id);


--
-- TOC entry 3439 (class 2606 OID 16756)
-- Name: fiche_passager fiche_passager_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_passager
    ADD CONSTRAINT fiche_passager_pkey PRIMARY KEY (fiche_id, passager_id);


--
-- TOC entry 3428 (class 2606 OID 16707)
-- Name: fiche fiche_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fiche_pkey PRIMARY KEY (id);


--
-- TOC entry 3430 (class 2606 OID 16709)
-- Name: fiche fiche_reference_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fiche_reference_key UNIQUE (reference);


--
-- TOC entry 3464 (class 2606 OID 16922)
-- Name: fiche_remise fiche_remise_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_remise
    ADD CONSTRAINT fiche_remise_pkey PRIMARY KEY (id);


--
-- TOC entry 3390 (class 2606 OID 16506)
-- Name: gare gare_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gare
    ADD CONSTRAINT gare_code_key UNIQUE (code);


--
-- TOC entry 3392 (class 2606 OID 16504)
-- Name: gare gare_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gare
    ADD CONSTRAINT gare_pkey PRIMARY KEY (id);


--
-- TOC entry 3416 (class 2606 OID 16577)
-- Name: itineraire itineraire_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itineraire
    ADD CONSTRAINT itineraire_pkey PRIMARY KEY (id);


--
-- TOC entry 3420 (class 2606 OID 16594)
-- Name: passager passager_numero_cni_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.passager
    ADD CONSTRAINT passager_numero_cni_key UNIQUE (numero_cni);


--
-- TOC entry 3422 (class 2606 OID 16592)
-- Name: passager passager_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.passager
    ADD CONSTRAINT passager_pkey PRIMARY KEY (id);


--
-- TOC entry 3460 (class 2606 OID 16848)
-- Name: proprietaire proprietaire_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proprietaire
    ADD CONSTRAINT proprietaire_pkey PRIMARY KEY (id);


--
-- TOC entry 3455 (class 2606 OID 16826)
-- Name: refresh_token refresh_token_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT refresh_token_pkey PRIMARY KEY (id);


--
-- TOC entry 3457 (class 2606 OID 16828)
-- Name: refresh_token refresh_token_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT refresh_token_token_hash_key UNIQUE (token_hash);


--
-- TOC entry 3470 (class 2606 OID 41684)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3426 (class 2606 OID 16669)
-- Name: sync_queue sync_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sync_queue
    ADD CONSTRAINT sync_queue_pkey PRIMARY KEY (id);


--
-- TOC entry 3380 (class 2606 OID 16416)
-- Name: role ukc36say97xydpmgigg38qv5l2p; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT ukc36say97xydpmgigg38qv5l2p UNIQUE (code);


--
-- TOC entry 3386 (class 2606 OID 16420)
-- Name: utilisateur ukkq7nt5wyq9v9lpcpgxag2f24a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT ukkq7nt5wyq9v9lpcpgxag2f24a UNIQUE (username);


--
-- TOC entry 3388 (class 2606 OID 16418)
-- Name: utilisateur ukrma38wvnqfaf66vvmi57c71lo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT ukrma38wvnqfaf66vvmi57c71lo UNIQUE (email);


--
-- TOC entry 3437 (class 2606 OID 25015)
-- Name: fiche uq_fiche_numero_bordereau; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT uq_fiche_numero_bordereau UNIQUE (numero_bordereau);


--
-- TOC entry 3418 (class 2606 OID 16579)
-- Name: itineraire uq_itineraire_destination_code; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itineraire
    ADD CONSTRAINT uq_itineraire_destination_code UNIQUE (destination_id, code);


--
-- TOC entry 3396 (class 2606 OID 16515)
-- Name: vehicule vehicule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicule
    ADD CONSTRAINT vehicule_pkey PRIMARY KEY (id);


--
-- TOC entry 3398 (class 2606 OID 16517)
-- Name: vehicule vehicule_plaque_immatriculation_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicule
    ADD CONSTRAINT vehicule_plaque_immatriculation_key UNIQUE (plaque_immatriculation);


--
-- TOC entry 3446 (class 1259 OID 16802)
-- Name: idx_alerte_document; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alerte_document ON public.alerte_document USING btree (document_id);


--
-- TOC entry 3447 (class 1259 OID 16805)
-- Name: idx_alerte_expiration; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alerte_expiration ON public.alerte_document USING btree (date_expiration);


--
-- TOC entry 3448 (class 1259 OID 16803)
-- Name: idx_alerte_proprietaire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alerte_proprietaire ON public.alerte_document USING btree (proprietaire_type, proprietaire_id);


--
-- TOC entry 3449 (class 1259 OID 16804)
-- Name: idx_alerte_statut; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alerte_statut ON public.alerte_document USING btree (statut);


--
-- TOC entry 3442 (class 1259 OID 49838)
-- Name: idx_audit_entite; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_entite ON public.audit_log USING btree (entite, entite_id);


--
-- TOC entry 3443 (class 1259 OID 16800)
-- Name: idx_audit_utilisateur; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_utilisateur ON public.audit_log USING btree (utilisateur_id);


--
-- TOC entry 3405 (class 1259 OID 33212)
-- Name: idx_chauffeur_gare_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_chauffeur_gare_id ON public.chauffeur USING btree (gare_id);


--
-- TOC entry 3408 (class 1259 OID 16674)
-- Name: idx_document_chauffeur_chauffeur; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_document_chauffeur_chauffeur ON public.document_chauffeur USING btree (chauffeur_id);


--
-- TOC entry 3409 (class 1259 OID 16675)
-- Name: idx_document_chauffeur_expiration; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_document_chauffeur_expiration ON public.document_chauffeur USING btree (date_expiration);


--
-- TOC entry 3401 (class 1259 OID 16673)
-- Name: idx_document_vehicule_expiration; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_document_vehicule_expiration ON public.document_vehicule USING btree (date_expiration);


--
-- TOC entry 3402 (class 1259 OID 16672)
-- Name: idx_document_vehicule_vehicule; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_document_vehicule_vehicule ON public.document_vehicule USING btree (vehicule_id);


--
-- TOC entry 3431 (class 1259 OID 16797)
-- Name: idx_fiche_chauffeur; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fiche_chauffeur ON public.fiche USING btree (chauffeur_id);


--
-- TOC entry 3432 (class 1259 OID 16798)
-- Name: idx_fiche_destination; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fiche_destination ON public.fiche USING btree (destination_id);


--
-- TOC entry 3433 (class 1259 OID 16795)
-- Name: idx_fiche_gare; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fiche_gare ON public.fiche USING btree (gare_id);


--
-- TOC entry 3434 (class 1259 OID 16877)
-- Name: idx_fiche_statut; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fiche_statut ON public.fiche USING btree (statut);


--
-- TOC entry 3435 (class 1259 OID 16796)
-- Name: idx_fiche_vehicule; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fiche_vehicule ON public.fiche USING btree (vehicule_id);


--
-- TOC entry 3414 (class 1259 OID 16676)
-- Name: idx_itineraire_destination; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_itineraire_destination ON public.itineraire USING btree (destination_id);


--
-- TOC entry 3458 (class 1259 OID 16855)
-- Name: idx_proprietaire_telephone; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_proprietaire_telephone ON public.proprietaire USING btree (telephone);


--
-- TOC entry 3451 (class 1259 OID 16836)
-- Name: idx_refresh_token_expires_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_refresh_token_expires_at ON public.refresh_token USING btree (expires_at);


--
-- TOC entry 3452 (class 1259 OID 41718)
-- Name: idx_refresh_token_session; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_refresh_token_session ON public.refresh_token USING btree (session_id);


--
-- TOC entry 3453 (class 1259 OID 16834)
-- Name: idx_refresh_token_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_refresh_token_user ON public.refresh_token USING btree (user_id);


--
-- TOC entry 3465 (class 1259 OID 41690)
-- Name: idx_sessions_actives; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessions_actives ON public.sessions USING btree (utilisateur_id, last_seen_at DESC) WHERE (revoked_at IS NULL);


--
-- TOC entry 3466 (class 1259 OID 41686)
-- Name: idx_sessions_expires; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessions_expires ON public.sessions USING btree (expires_at);


--
-- TOC entry 3467 (class 1259 OID 41699)
-- Name: idx_sessions_gare; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessions_gare ON public.sessions USING btree (gare_id);


--
-- TOC entry 3468 (class 1259 OID 41689)
-- Name: idx_sessions_utilisateur; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessions_utilisateur ON public.sessions USING btree (utilisateur_id);


--
-- TOC entry 3423 (class 1259 OID 16678)
-- Name: idx_sync_queue_entity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sync_queue_entity ON public.sync_queue USING btree (entity_type, entity_id);


--
-- TOC entry 3424 (class 1259 OID 16677)
-- Name: idx_sync_queue_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sync_queue_status ON public.sync_queue USING btree (status);


--
-- TOC entry 3383 (class 1259 OID 16680)
-- Name: idx_utilisateur_gare; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_utilisateur_gare ON public.utilisateur USING btree (gare_id);


--
-- TOC entry 3384 (class 1259 OID 16671)
-- Name: idx_utilisateur_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_utilisateur_role ON public.utilisateur USING btree (role_id);


--
-- TOC entry 3393 (class 1259 OID 33213)
-- Name: idx_vehicule_gare_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicule_gare_id ON public.vehicule USING btree (gare_id);


--
-- TOC entry 3394 (class 1259 OID 16854)
-- Name: idx_vehicule_proprietaire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicule_proprietaire ON public.vehicule USING btree (proprietaire_id);


--
-- TOC entry 3450 (class 1259 OID 33201)
-- Name: uq_alerte_document_echeance; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_alerte_document_echeance ON public.alerte_document USING btree (document_id, proprietaire_type, date_expiration, type_alerte);


--
-- TOC entry 3471 (class 2606 OID 16453)
-- Name: utilisateur FK_332c39ebc87e25e15a3e80aab48; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT "FK_332c39ebc87e25e15a3e80aab48" FOREIGN KEY (role_id) REFERENCES public.role(id);


--
-- TOC entry 3490 (class 2606 OID 16790)
-- Name: alerte_document fk_alerte_utilisateur_lecture; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerte_document
    ADD CONSTRAINT fk_alerte_utilisateur_lecture FOREIGN KEY (utilisateur_lecture) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3489 (class 2606 OID 16776)
-- Name: audit_log fk_audit_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT fk_audit_utilisateur FOREIGN KEY (utilisateur_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3476 (class 2606 OID 33202)
-- Name: chauffeur fk_chauffeur_gare; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chauffeur
    ADD CONSTRAINT fk_chauffeur_gare FOREIGN KEY (gare_id) REFERENCES public.gare(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 3477 (class 2606 OID 16553)
-- Name: document_chauffeur fk_document_chauffeur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_chauffeur
    ADD CONSTRAINT fk_document_chauffeur FOREIGN KEY (chauffeur_id) REFERENCES public.chauffeur(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3475 (class 2606 OID 16529)
-- Name: document_vehicule fk_document_vehicule; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_vehicule
    ADD CONSTRAINT fk_document_vehicule FOREIGN KEY (vehicule_id) REFERENCES public.vehicule(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3479 (class 2606 OID 16745)
-- Name: fiche fk_fiche_annulateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_annulateur FOREIGN KEY (annulateur_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3480 (class 2606 OID 16720)
-- Name: fiche fk_fiche_chauffeur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_chauffeur FOREIGN KEY (chauffeur_id) REFERENCES public.chauffeur(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3481 (class 2606 OID 16735)
-- Name: fiche fk_fiche_createur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_createur FOREIGN KEY (createur_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3482 (class 2606 OID 16725)
-- Name: fiche fk_fiche_destination; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_destination FOREIGN KEY (destination_id) REFERENCES public.destination(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3483 (class 2606 OID 16740)
-- Name: fiche fk_fiche_finalisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_finalisateur FOREIGN KEY (finalisateur_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3484 (class 2606 OID 16710)
-- Name: fiche fk_fiche_gare; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_gare FOREIGN KEY (gare_id) REFERENCES public.gare(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3493 (class 2606 OID 16903)
-- Name: fiche_impression fk_fiche_impression_fiche; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_impression
    ADD CONSTRAINT fk_fiche_impression_fiche FOREIGN KEY (fiche_id) REFERENCES public.fiche(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3494 (class 2606 OID 16908)
-- Name: fiche_impression fk_fiche_impression_imprimeur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_impression
    ADD CONSTRAINT fk_fiche_impression_imprimeur FOREIGN KEY (imprimeur_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3485 (class 2606 OID 16730)
-- Name: fiche fk_fiche_itineraire; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_itineraire FOREIGN KEY (itineraire_id) REFERENCES public.itineraire(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3487 (class 2606 OID 16757)
-- Name: fiche_passager fk_fiche_passager_fiche; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_passager
    ADD CONSTRAINT fk_fiche_passager_fiche FOREIGN KEY (fiche_id) REFERENCES public.fiche(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3488 (class 2606 OID 16762)
-- Name: fiche_passager fk_fiche_passager_passager; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_passager
    ADD CONSTRAINT fk_fiche_passager_passager FOREIGN KEY (passager_id) REFERENCES public.passager(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3495 (class 2606 OID 16923)
-- Name: fiche_remise fk_fiche_remise_fiche; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_remise
    ADD CONSTRAINT fk_fiche_remise_fiche FOREIGN KEY (fiche_id) REFERENCES public.fiche(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3496 (class 2606 OID 16928)
-- Name: fiche_remise fk_fiche_remise_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche_remise
    ADD CONSTRAINT fk_fiche_remise_utilisateur FOREIGN KEY (remise_par_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3486 (class 2606 OID 16715)
-- Name: fiche fk_fiche_vehicule; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiche
    ADD CONSTRAINT fk_fiche_vehicule FOREIGN KEY (vehicule_id) REFERENCES public.vehicule(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3478 (class 2606 OID 16580)
-- Name: itineraire fk_itineraire_destination; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itineraire
    ADD CONSTRAINT fk_itineraire_destination FOREIGN KEY (destination_id) REFERENCES public.destination(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3491 (class 2606 OID 41729)
-- Name: refresh_token fk_refresh_token_session; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT fk_refresh_token_session FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3492 (class 2606 OID 16829)
-- Name: refresh_token fk_refresh_token_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT fk_refresh_token_user FOREIGN KEY (user_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3497 (class 2606 OID 41713)
-- Name: sessions fk_sessions_gare; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT fk_sessions_gare FOREIGN KEY (gare_id) REFERENCES public.gare(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3498 (class 2606 OID 41708)
-- Name: sessions fk_sessions_utilisateur; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT fk_sessions_utilisateur FOREIGN KEY (utilisateur_id) REFERENCES public.utilisateur(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3472 (class 2606 OID 16691)
-- Name: utilisateur fk_utilisateur_gare; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT fk_utilisateur_gare FOREIGN KEY (gare_id) REFERENCES public.gare(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3473 (class 2606 OID 33207)
-- Name: vehicule fk_vehicule_gare; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicule
    ADD CONSTRAINT fk_vehicule_gare FOREIGN KEY (gare_id) REFERENCES public.gare(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 3474 (class 2606 OID 16849)
-- Name: vehicule fk_vehicule_proprietaire; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicule
    ADD CONSTRAINT fk_vehicule_proprietaire FOREIGN KEY (proprietaire_id) REFERENCES public.proprietaire(id) ON UPDATE CASCADE ON DELETE RESTRICT;


-- Completed on 2026-11-09 10:57:28

--
-- PostgreSQL database dump complete
--

\unrestrict qL9ZWcMCfC49ZIdwEAqXrsZnZsBFxZOJ3BTcIgPhBYHNkdLvuNHmvjZqsKqrbeZ

