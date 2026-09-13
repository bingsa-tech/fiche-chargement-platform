import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Fiche } from '../../fiches/entities/fiche.entity';
import { Utilisateur } from '../../utilisateurs/entities/utilisateur.entity';
import { GareStatut } from '../enums/gare-statut.enum';

@Entity('gare', { schema: 'public' })
export class Gare {
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
    length: 255,
    nullable: true,
  })
  adresse: string | null;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'statut',
  })
  statut: GareStatut;

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
    () => Fiche,
    (fiche) => fiche.gare,
  )
  fiches: Fiche[];

  @OneToMany(
    () => Utilisateur,
    (utilisateur) => utilisateur.gare,
  )
  utilisateurs: Utilisateur[];
}