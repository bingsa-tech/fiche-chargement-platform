import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DocumentVehicule } from '../../documents/entities/document-vehicule.entity';
import { Fiche } from '../../fiches/entities/fiche.entity';
import { VehiculeStatut } from '../enums/vehicule-statut.enum';

@Entity('vehicule', { schema: 'public' })
export class Vehicule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
  })
  plaqueImmatriculation: string;

  @Column({
    type: 'varchar',
    length: 30,
  })
  type: string;

  @Column({
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  marque: string | null;

  @Column({
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  modele: string | null;

  @Column({
    type: 'integer',
  })
  capacite: number;

  @Column({
    type: 'varchar',
    length: 20,
  })
  statut: VehiculeStatut;

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

  @OneToMany(
    () => DocumentVehicule,
    (documentVehicule) => documentVehicule.vehicule,
  )
  documentsVehicules: DocumentVehicule[];

  @OneToMany(
    () => Fiche,
    (fiche) => fiche.vehicule,
  )
  fiches: Fiche[];
}