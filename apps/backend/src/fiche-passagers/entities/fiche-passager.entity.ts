import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { Fiche } from '../../fiches/entities/fiche.entity';
import { Passager } from '../../passagers/entities/passager.entity';

@Entity('fiche_passager', { schema: 'public' })
export class FichePassager {
  @PrimaryColumn('uuid', {
    name: 'fiche_id',
  })
  ficheId: string;

  @PrimaryColumn('uuid', {
    name: 'passager_id',
  })
  passagerId: string;

  @Column('integer', {
    name: 'numero_place',
    nullable: true,
  })
  numeroPlace: number | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  // =========================
  // RELATIONS
  // =========================

  @ManyToOne(
    () => Fiche,
    (fiche) => fiche.fichePassagers,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'fiche_id',
    referencedColumnName: 'id',
  })
  fiche: Fiche;

  @ManyToOne(
    () => Passager,
    (passager) => passager.fichePassagers,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'passager_id',
    referencedColumnName: 'id',
  })
  passager: Passager;
}