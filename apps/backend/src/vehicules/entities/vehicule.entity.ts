import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DocumentVehicule } from '../../documents/entities/document-vehicule.entity';
import { Fiche } from '../../fiches/entities/fiche.entity';
import { Proprietaire } from '../../proprietaires/entities/proprietaire.entity';
import { VehiculeStatut } from '../enums/vehicule-statut.enum';

@Entity('vehicule', { schema: 'public' })
export class Vehicule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'plaque_immatriculation',
    type: 'varchar',
    length: 30,
    unique: true,
  })
  plaqueImmatriculation!: string;

  @Column({
    type: 'varchar',
    length: 30,
  })
  type!: string;

  @Column({
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  marque!: string | null;

  @Column({
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  modele!: string | null;

  @Column({
    type: 'integer',
  })
  capacite!: number;

  @Column({
    type: 'varchar',
    length: 20,
  })
  statut!: VehiculeStatut;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  // =========================
  // PROPRIÉTAIRE
  // =========================

  @ManyToOne(
    () => Proprietaire,
    (proprietaire) => proprietaire.vehicules,
    {
      nullable: true,
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'proprietaire_id',
    referencedColumnName: 'id',
  })
  proprietaire!: Proprietaire | null;

  @Column('uuid', { name: 'proprietaire_id', nullable: true })
  proprietaireId!: string | null;

  // =========================
  // DOCUMENTS
  // =========================

  @OneToMany(
    () => DocumentVehicule,
    (documentVehicule) => documentVehicule.vehicule,
  )
  documentsVehicules!: DocumentVehicule[];

  // =========================
  // FICHES
  // =========================

  @OneToMany(
    () => Fiche,
    (fiche) => fiche.vehicule,
  )
  fiches!: Fiche[];
}