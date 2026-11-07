
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
import { Gare } from '../../gares/entities/gare.entity';

export enum PresenceDeviceType {
  WEB = 'WEB',
  MOBILE = 'MOBILE',
}

@Entity('sessions', { schema: 'public' })
@Index(
  'idx_sessions_actives',
  ['utilisateurId', 'lastSeenAt'],
  {
    where: '"revoked_at" IS NULL',
  },
)
@Index('idx_sessions_expires', ['expiresAt'])
@Index('idx_sessions_gare', ['gareId'])
@Index('idx_sessions_utilisateur', ['utilisateurId'])
export class PresenceSession {
  // Identifiant de session
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Utilisateur associé
  @Column({
    name: 'utilisateur_id',
    type: 'integer',
  })
  utilisateurId!: number;

  @ManyToOne(
    () => Utilisateur,
    {
      nullable: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'utilisateur_id',
    referencedColumnName: 'id',
  })
  utilisateur!: Utilisateur;

  // Gare associée
  @Column({
    name: 'gare_id',
    type: 'uuid',
    nullable: true,
  })
  gareId!: string | null;

  @ManyToOne(
    () => Gare,
    {
      nullable: true,
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'gare_id',
    referencedColumnName: 'id',
  })
  gare!: Gare | null;

  // Type d'appareil : WEB ou MOBILE
  @Column({
    name: 'device_type',
    type: 'varchar',
    length: 10,
  })
  deviceType!: PresenceDeviceType;

  // Nom ou description de l'appareil
  @Column({
    name: 'device_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  deviceName!: string | null;

  // Dernière activité
  @Column({
    name: 'last_seen_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastSeenAt!: Date;

  // Date de connexion
  @CreateDateColumn({
    name: 'connected_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  connectedAt!: Date;

  // Expiration de la session
  @Column({
    name: 'expires_at',
    type: 'timestamptz',
  })
  expiresAt!: Date;

  // Date de révocation
  @Column({
    name: 'revoked_at',
    type: 'timestamptz',
    nullable: true,
  })
  revokedAt!: Date | null;
}
