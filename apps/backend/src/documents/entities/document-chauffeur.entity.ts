import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Chauffeur } from '../../chauffeurs/entities/chauffeur.entity';

@Entity('document_chauffeur', { schema: 'public' })
@Index('idx_document_chauffeur_chauffeur', ['chauffeurId'])
@Index('idx_document_chauffeur_expiration', ['dateExpiration'])
export class DocumentChauffeur {
  // =====================================================
  // IDENTIFIANT
  // =====================================================

  @PrimaryGeneratedColumn('uuid')
  id: string;

  // =====================================================
  // CLÉ ÉTRANGÈRE CHAUFFEUR
  // =====================================================

  @Column('uuid', {
    name: 'chauffeur_id',
  })
  chauffeurId: string;

  // =====================================================
  // INFORMATIONS DU DOCUMENT
  // =====================================================

  @Column('varchar', {
    name: 'type_document',
    length: 50,
  })
  typeDocument: string;

  @Column('varchar', {
    name: 'numero_document',
    length: 100,
    nullable: true,
  })
  numeroDocument: string | null;

  @Column('date', {
    name: 'date_delivrance',
    nullable: true,
  })
  dateDelivrance: Date | null;

  @Column('date', {
    name: 'date_expiration',
  })
  dateExpiration: Date;

  @Column('varchar', {
    name: 'statut',
    length: 20,
  })
  statut: string;

  @Column('text', {
    name: 'observations',
    nullable: true,
  })
  observations: string | null;

  // =====================================================
  // DATES DE TRAÇABILITÉ
  // =====================================================

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  // =====================================================
  // RELATION CHAUFFEUR
  //
  // Chauffeur 1 ---- N DocumentChauffeur
  // =====================================================

  @ManyToOne(
    () => Chauffeur,
    (chauffeur) => chauffeur.documentChauffeurs,
    {
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'chauffeur_id',
    referencedColumnName: 'id',
  })
  chauffeur: Chauffeur;
}