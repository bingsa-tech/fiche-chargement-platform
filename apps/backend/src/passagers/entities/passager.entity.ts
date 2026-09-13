import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { FichePassager } from '../../fiche-passagers/entities/fiche-passager.entity';

@Entity('passager', { schema: 'public' })
export class Passager {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  nom: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  prenom: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    name: 'numero_cni',
  })
  numeroCni: string;

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
    () => FichePassager,
    (fichePassager) => fichePassager.passager,
  )
  fichePassagers: FichePassager[];
}