import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Chauffeur } from '../../chauffeurs/entities/chauffeur.entity';
import { Vehicule } from '../../vehicules/entities/vehicule.entity';
import { Gare } from '../../gares/entities/gare.entity';
import { Destination } from '../../destinations/entities/destination.entity';
import { Itineraire } from '../../itineraires/entities/itineraire.entity';
import { Utilisateur } from '../../utilisateurs/entities/utilisateur.entity';
import { FichePassager } from '../../fiche-passagers/entities/fiche-passager.entity';

import { FicheStatut } from '../enums/fiche-statut.enum';

@Entity('fiche', { schema: 'public' })
@Index('idx_fiche_chauffeur', ['chauffeurId'])
@Index('idx_fiche_destination', ['destinationId'])
@Index('idx_fiche_gare', ['gareId'])
@Index('idx_fiche_statut', ['statut'])
@Index('idx_fiche_vehicule', ['vehiculeId'])
export class Fiche {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  reference: string;

  @Column('uuid', { name: 'gare_id' })
  gareId: string;

  @Column('uuid', { name: 'vehicule_id' })
  vehiculeId: string;

  @Column('uuid', { name: 'chauffeur_id' })
  chauffeurId: string;

  @Column('uuid', { name: 'destination_id' })
  destinationId: string;

  @Column('uuid', {
    name: 'itineraire_id',
    nullable: true,
  })
  itineraireId: string | null;

  @Column('integer', { name: 'createur_id' })
  createurId: number;

  @Column('integer', {
    name: 'finalisateur_id',
    nullable: true,
  })
  finalisateurId: number | null;

  @Column('integer', {
    name: 'annulateur_id',
    nullable: true,
  })
  annulateurId: number | null;

  @Column({
    type: 'timestamp',
    name: 'date_creation',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateCreation: Date;

  @Column({
    type: 'timestamp',
    name: 'heure_arrivee_gare',
    nullable: true,
  })
  heureArriveeGare: Date | null;

  @Column({
    type: 'timestamp',
    name: 'heure_depart',
    nullable: true,
  })
  heureDepart: Date | null;

  @Column({
    type: 'timestamp',
    name: 'heure_arrivee_destination',
    nullable: true,
  })
  heureArriveeDestination: Date | null;

  @Column({
    type: 'timestamp',
    name: 'date_finalisation',
    nullable: true,
  })
  dateFinalisation: Date | null;

  @Column({
    type: 'timestamp',
    name: 'date_cloture',
    nullable: true,
  })
  dateCloture: Date | null;

  @Column({
    type: 'timestamp',
    name: 'date_annulation',
    nullable: true,
  })
  dateAnnulation: Date | null;

  @Column({
    type: 'varchar',
    length: 30,
  })
  statut: FicheStatut;

  @Column({
    type: 'text',
    name: 'motif_annulation',
    nullable: true,
  })
  motifAnnulation: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  // =========================
  // RELATIONS
  // =========================

  @ManyToOne(() => Gare, (gare) => gare.fiches, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'gare_id',
    referencedColumnName: 'id',
  })
  gare: Gare;

  @ManyToOne(() => Vehicule, (vehicule) => vehicule.fiches, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'vehicule_id',
    referencedColumnName: 'id',
  })
  vehicule: Vehicule;

  @ManyToOne(() => Chauffeur, (chauffeur) => chauffeur.fiches, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'chauffeur_id',
    referencedColumnName: 'id',
  })
  chauffeur: Chauffeur;

  @ManyToOne(() => Destination, (destination) => destination.fiches, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'destination_id',
    referencedColumnName: 'id',
  })
  destination: Destination;

  @ManyToOne(() => Itineraire, (itineraire) => itineraire.fiches, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'itineraire_id',
    referencedColumnName: 'id',
  })
  itineraire: Itineraire | null;

  @ManyToOne(() => Utilisateur, (utilisateur) => utilisateur.fiches, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'createur_id',
    referencedColumnName: 'id',
  })
  createur: Utilisateur;

  @ManyToOne(
    () => Utilisateur,
    (utilisateur) => utilisateur.fichesFinalisees,
    {
      nullable: true,
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'finalisateur_id',
    referencedColumnName: 'id',
  })
  finalisateur: Utilisateur | null;

  @ManyToOne(
    () => Utilisateur,
    (utilisateur) => utilisateur.fichesAnnulees,
    {
      nullable: true,
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'annulateur_id',
    referencedColumnName: 'id',
  })
  annulateur: Utilisateur | null;

  @OneToMany(
    () => FichePassager,
    (fichePassager) => fichePassager.fiche,
  )
  fichePassagers: FichePassager[];
}