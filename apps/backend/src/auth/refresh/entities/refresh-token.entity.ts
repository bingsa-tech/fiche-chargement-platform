
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
@Index('idx_refresh_token_session', ['sessionId'])
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: 'user_id',
    type: 'integer',
  })
  userId!: number;

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
  user!: Utilisateur;

  @Column({
    name: 'token_hash',
    type: 'varchar',
    length: 255,
    unique: true,
  })
  tokenHash!: string;

  @Column({
    name: 'expires_at',
    type: 'timestamp',
  })
  expiresAt!: Date;

  @Column({
    name: 'revoked_at',
    type: 'timestamp',
    nullable: true,
  })
  revokedAt!: Date | null;

  // Identifiant du token qui remplace ce token
  @Column({
    name: 'replaced_by_token_id',
    type: 'integer',
    nullable: true,
  })
  replacedByTokenId!: number | null;

  @ManyToOne(() => RefreshToken, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'replaced_by_token_id',
    referencedColumnName: 'id',
  })
  replacedBy!: RefreshToken | null;

  @Column({
    name: 'user_agent',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  userAgent!: string | null;

  @Column({
    name: 'ip_address',
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  ipAddress!: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @Column({
    name: 'session_id',
    type: 'uuid',
    nullable: true,
  })
  sessionId!: string | null;
}
