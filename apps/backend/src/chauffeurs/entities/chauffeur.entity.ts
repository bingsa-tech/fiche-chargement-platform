import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DocumentChauffeur } from '../../documents/entities/document-chauffeur.entity';
import { Fiche } from '../../fiches/entities/fiche.entity';
import { ChauffeurStatut } from '../enums/chauffeur-statut.enum';

@Entity('chauffeur')
export class Chauffeur {
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
    length: 30,
    nullable: true,
  })
  telephone: string | null;

  @Column({
    type: 'varchar',
    length: 20,
  })
  statut: ChauffeurStatut;

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
    () => DocumentChauffeur,
    (documentChauffeur) => documentChauffeur.chauffeur,
  )
  documentChauffeurs: DocumentChauffeur[];

  @OneToMany(
    () => Fiche,
    (fiche) => fiche.chauffeur,
  )
  fiches: Fiche[];
}