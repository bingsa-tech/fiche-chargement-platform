import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Utilisateur } from '../../utilisateurs/entities/utilisateur.entity';

import { AlerteProprietaireType } from '../enums/alerte-proprietaire-type.enum';
import { AlerteType } from '../enums/alerte-type.enum';
import { AlerteStatut } from '../enums/alerte-statut.enum';

@Entity('alerte_document', { schema: 'public' })
@Index('idx_alerte_document', ['documentId'])
@Index('idx_alerte_expiration', ['dateExpiration'])
@Index('idx_alerte_proprietaire', [
  'proprietaireType',
  'proprietaireId',
])
@Index('idx_alerte_statut', ['statut'])
export class AlerteDocument {
  // =====================================================
  // IDENTIFIANT
  // =====================================================

  @PrimaryGeneratedColumn('uuid')
  id: string;

  // =====================================================
  // DOCUMENT
  // =====================================================

  @Column({
    type: 'varchar',
    length: 50,
    name: 'type_document',
  })
  typeDocument: string;

  @Column('uuid', {
    name: 'document_id',
  })
  documentId: string;

  // =====================================================
  // PROPRIÉTAIRE
  // CHAUFFEUR ou VEHICULE
  // =====================================================

  @Column({
    type: 'varchar',
    length: 30,
    name: 'proprietaire_type',
  })
  proprietaireType: AlerteProprietaireType;

  @Column('uuid', {
    name: 'proprietaire_id',
  })
  proprietaireId: string;

  // =====================================================
  // DATES
  // =====================================================

  @Column({
    type: 'date',
    name: 'date_declenchement',
  })
  dateDeclenchement: string;

  @Column({
    type: 'date',
    name: 'date_expiration',
  })
  dateExpiration: string;

  // =====================================================
  // TYPE ET STATUT DE L'ALERTE
  // =====================================================

  @Column({
    type: 'varchar',
    length: 30,
    name: 'type_alerte',
  })
  typeAlerte: AlerteType;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'statut',
  })
  statut: AlerteStatut;

  // =====================================================
  // LECTURE
  // =====================================================

  @Column({
    type: 'timestamp',
    name: 'date_lecture',
    nullable: true,
  })
  dateLecture: Date | null;

  @Column({
    type: 'integer',
    name: 'utilisateur_lecture',
    nullable: true,
  })
  utilisateurLecture: number | null;

  // =====================================================
  // DATE DE CRÉATION
  // =====================================================

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  // =====================================================
  // UTILISATEUR AYANT LU L'ALERTE
  // =====================================================

  @ManyToOne(
    () => Utilisateur,
    (utilisateur) => utilisateur.alertesLues,
    {
      nullable: true,
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'utilisateur_lecture',
    referencedColumnName: 'id',
  })
  utilisateur: Utilisateur | null;
}