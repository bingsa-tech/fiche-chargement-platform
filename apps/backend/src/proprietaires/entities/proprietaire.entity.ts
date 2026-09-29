import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Vehicule } from '../../vehicules/entities/vehicule.entity';

@Entity('proprietaire', { schema: 'public' })
export class Proprietaire {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { length: 100 })
  nom!: string;

  @Column('varchar', { length: 100 })
  prenom!: string;

  @Column('varchar', { length: 30, nullable: true })
  telephone!: string | null;

  @Column('text', { nullable: true })
  adresse!: string | null;

  @Column('varchar', {
    name: 'numero_piece_identite',
    length: 100,
    nullable: true,
  })
  numeroPieceIdentite!: string | null;

  @Column('varchar', {
    name: 'type_piece_identite',
    length: 50,
    nullable: true,
  })
  typePieceIdentite!: string | null;

  @Column('varchar', { length: 20 })
  statut!: string;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @Column('timestamp', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  @OneToMany(
    () => Vehicule,
    (vehicule) => vehicule.proprietaire,
  )
  vehicules!: Vehicule[];
}