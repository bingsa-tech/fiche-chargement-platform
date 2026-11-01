
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('audit_log')
@Index('idx_audit_entite', ['entite', 'entiteId'])
@Index('idx_audit_utilisateur', ['utilisateurId'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'utilisateur_id',
    type: 'integer',
    nullable: true,
  })
  utilisateurId!: number | null;

  @Column({
    type: 'varchar',
    length: 50,
  })
  action!: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  entite!: string;

  @Column({
    name: 'entite_id',
    type: 'uuid',
  })
  entiteId!: string;

  @CreateDateColumn({
    name: 'date_heure',
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateHeure!: Date;

  @Column({
    name: 'ancienne_valeur',
    type: 'jsonb',
    nullable: true,
  })
  ancienneValeur!: Record<string, unknown> | null;

  @Column({
    name: 'nouvelle_valeur',
    type: 'jsonb',
    nullable: true,
  })
  nouvelleValeur!: Record<string, unknown> | null;

  @Column({
    name: 'appareil_id',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  appareilId!: string | null;
}
