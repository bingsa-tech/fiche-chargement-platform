import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Utilisateur } from '../../utilisateurs/entities/utilisateur.entity';

@Entity('role', { schema: 'public' })
export class Role {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  libelle: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string | null;

  @Column({
    type: 'boolean',
    default: true,
  })
  actif: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    precision: 6,
    default: () => 'now()',
  })
  createdAt: Date;

  @OneToMany(
    () => Utilisateur,
    (utilisateur) => utilisateur.role,
  )
  utilisateurs: Utilisateur[];
}