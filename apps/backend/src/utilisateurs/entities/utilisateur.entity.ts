import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from '../../roles/entities/role.entity';
import { Gare } from '../../gares/entities/gare.entity';
import { Fiche } from '../../fiches/entities/fiche.entity';
import { AlerteDocument } from '../../alertes/entities/alerte-document.entity';

@Entity('utilisateur', { schema: 'public' })
@Index('idx_utilisateur_gare', ['gareId'])
@Index('idx_utilisateur_role', ['roleId'])
export class Utilisateur {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 100 })
  nom: string;

  @Column({ type: 'varchar', length: 100 })
  prenom: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telephone: string | null;

  @Column({ type: 'boolean', default: true })
  actif: boolean;

  @Column({ type: 'boolean', default: false })
  bloque: boolean;

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date | null;

  // =========================
  // CLÉS ÉTRANGÈRES
  // =========================

  @Column({ name: 'gare_id', type: 'uuid', nullable: true })
  gareId: string | null;

  @Column({ name: 'role_id', type: 'integer', nullable: true })
  roleId: number | null;

  // =========================
  // DATES
  // =========================

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

  // =========================
  // RELATION ROLE
  // =========================

  @ManyToOne(() => Role, (role) => role.utilisateurs, { nullable: true })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: Role | null;

  // =========================
  // RELATION GARE
  // =========================

  @ManyToOne(() => Gare, (gare) => gare.utilisateurs, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'gare_id', referencedColumnName: 'id' })
  gare: Gare | null;

  // =========================
  // FICHES CRÉÉES
  // =========================

  @OneToMany(() => Fiche, (fiche) => fiche.createur)
  fiches: Fiche[];

  // =========================
  // FICHES FINALISÉES
  // =========================

  @OneToMany(() => Fiche, (fiche) => fiche.finalisateur)
  fichesFinalisees: Fiche[];

  // =========================
  // FICHES ANNULÉES
  // =========================

  @OneToMany(() => Fiche, (fiche) => fiche.annulateur)
  fichesAnnulees: Fiche[];

  // =========================
  // ALERTES LUES PAR L'UTILISATEUR
  // =========================

  @OneToMany(() => AlerteDocument, (alerte) => alerte.utilisateur)
  alertesLues: AlerteDocument[];
}
