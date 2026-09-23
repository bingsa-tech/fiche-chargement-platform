import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Utilisateur } from '../../../utilisateurs/entities/utilisateur.entity';

@Entity('refresh_token', { schema: 'public' })
@Index('idx_refresh_token_user', ['userId'])
@Index('idx_refresh_token_hash', ['tokenHash'])
@Index('idx_refresh_token_expires_at', ['expiresAt'])
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  // =========================
  // UTILISATEUR
  // =========================

  @Column({
    name: 'user_id',
    type: 'integer',
  })
  userId: number;

  @ManyToOne(
    () => Utilisateur,
    {
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: Utilisateur;

  // =========================
  // TOKEN
  // =========================

  @Column({
    name: 'token_hash',
    type: 'varchar',
    length: 255,
    unique: true,
  })
  tokenHash: string;

  // =========================
  // EXPIRATION
  // =========================

  @Column({
    name: 'expires_at',
    type: 'timestamp',
  })
  expiresAt: Date;

  // =========================
  // RÉVOCATION
  // =========================

  @Column({
    name: 'revoked_at',
    type: 'timestamp',
    nullable: true,
  })
  revokedAt: Date | null;

  // =========================
  // ROTATION
  // =========================

  @Column({
    name: 'replaced_by_token_id',
    type: 'integer',
    nullable: true,
  })
  replacedByTokenId: number | null;

  // =========================
  // CONTEXTE DE SESSION
  // =========================

  @Column({
    name: 'user_agent',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  userAgent: string | null;

  @Column({
    name: 'ip_address',
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  ipAddress: string | null;

  // =========================
  // DATE DE CRÉATION
  // =========================

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}

