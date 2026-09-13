
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Vehicule } from '../../vehicules/entities/vehicule.entity';

@Entity('document_vehicule', { schema: 'public' })
@Index('idx_document_vehicule_expiration', ['dateExpiration'])
@Index('idx_document_vehicule_vehicule', ['vehiculeId'])
export class DocumentVehicule {
  // =====================================================
  // IDENTIFIANT
  // =====================================================

  @PrimaryGeneratedColumn('uuid')
  id: string;

  // =====================================================
  // CLÉ ÉTRANGÈRE VÉHICULE
  // =====================================================

  @Column('uuid', {
    name: 'vehicule_id',
  })
  vehiculeId: string;

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
  // RELATION VÉHICULE
  //
  // Vehicule 1 ---- N DocumentVehicule
  // =====================================================

  @ManyToOne(
    () => Vehicule,
    (vehicule) => vehicule.documentsVehicules,
    {
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'vehicule_id',
    referencedColumnName: 'id',
  })
  vehicule: Vehicule;
}
