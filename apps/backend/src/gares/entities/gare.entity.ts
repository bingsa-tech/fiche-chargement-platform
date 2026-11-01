import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Fiche } from '../../fiches/entities/fiche.entity';
import { Utilisateur } from '../../utilisateurs/entities/utilisateur.entity';
import { GareStatut } from '../enums/gare-statut.enum';
import { Chauffeur } from '../../chauffeurs/entities/chauffeur.entity';
import { Vehicule } from '../../vehicules/entities/vehicule.entity';
@Entity('gare', { schema: 'public' })
export class Gare {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
  })
  code!: string;

  @Column({
    type: 'varchar',
    length: 150,
  })
  nom!: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  ville!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  adresse!: string | null;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'statut',
  })
  statut!: GareStatut;

  @Column({
  type: 'double precision',
  nullable: true,
})
latitude!: number | null;

@Column({
  type: 'double precision',
  nullable: true,
})
longitude!: number | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  @OneToMany(
    () => Fiche,
    (fiche) => fiche.gare,
  )
  fiches!: Fiche[];

  @OneToMany(
    () => Utilisateur,
    (utilisateur) => utilisateur.gare,
  )
  utilisateurs!: Utilisateur[];

  @OneToMany(
  () => Chauffeur,
  (chauffeur) => chauffeur.gare,
)
chauffeurs!: Chauffeur[];

@OneToMany(
  () => Vehicule,
  (vehicule) => vehicule.gare,
)
vehicules!: Vehicule[];
}
