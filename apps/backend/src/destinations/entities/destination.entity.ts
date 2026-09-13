import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Fiche } from '../../fiches/entities/fiche.entity';
import { Itineraire } from '../../itineraires/entities/itineraire.entity';
import { DestinationStatut } from '../enums/destination-statut.enum';

@Entity('destination', { schema: 'public' })
export class Destination {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 150,
  })
  nom: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  ville: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  pays: string;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'statut',
  })
  statut: DestinationStatut;

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

  @OneToMany(
    () => Fiche,
    (fiche) => fiche.destination,
  )
  fiches: Fiche[];

  @OneToMany(
    () => Itineraire,
    (itineraire) => itineraire.destination,
  )
  itineraires: Itineraire[];
}