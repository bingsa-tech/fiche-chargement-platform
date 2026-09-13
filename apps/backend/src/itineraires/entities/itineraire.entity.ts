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

import { Destination } from '../../destinations/entities/destination.entity';
import { Fiche } from '../../fiches/entities/fiche.entity';
import { ItineraireStatut } from '../enums/itineraire-statut.enum';

@Entity('itineraire', { schema: 'public' })
@Index('idx_itineraire_destination', ['destinationId'])
@Index(
  'uq_itineraire_destination_code',
  ['destinationId', 'code'],
  { unique: true },
)
export class Itineraire {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', {
    name: 'destination_id',
  })
  destinationId: string;

  @Column({
    type: 'varchar',
    length: 30,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 150,
  })
  libelle: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string | null;

  @Column({
    type: 'varchar',
    length: 20,
  })
  statut: ItineraireStatut;

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

  @ManyToOne(
    () => Destination,
    (destination) => destination.itineraires,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'destination_id',
    referencedColumnName: 'id',
  })
  destination: Destination;

  @OneToMany(
    () => Fiche,
    (fiche) => fiche.itineraire,
  )
  fiches: Fiche[];
}