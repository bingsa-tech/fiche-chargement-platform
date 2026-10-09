import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Fiche } from '../../fiches/entities/fiche.entity';
import { Utilisateur } from '../../utilisateurs/entities/utilisateur.entity';

@Entity('fiche_impression')
export class FicheImpression {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'fiche_id',
    type: 'uuid',
  })
  ficheId!: string;

  @Column({
    name: 'imprimeur_id',
    type: 'integer',
  })
  imprimeurId!: number;

  @CreateDateColumn({
    name: 'date_impression',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateImpression!: Date;

  @Column({
    name: 'numero_exemplaire',
    type: 'integer',
    default: 1,
  })
  numeroExemplaire!: number;

  @Column({
    name: 'motif_reimpression',
    type: 'text',
    nullable: true,
  })
  motifReimpression!: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  // =====================================================
  // RELATION FICHE
  // =====================================================

  @ManyToOne(
    () => Fiche,
    { onDelete: 'RESTRICT' },
  )
  @JoinColumn({
    name: 'fiche_id',
  })
  fiche!: Fiche;

  // =====================================================
  // RELATION UTILISATEUR / IMPRIMEUR
  // =====================================================

  @ManyToOne(
    () => Utilisateur,
    { onDelete: 'RESTRICT' },
  )
  @JoinColumn({
    name: 'imprimeur_id',
  })
  imprimeur!: Utilisateur;
}