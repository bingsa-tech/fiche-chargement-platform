
import {
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';
import { Gare } from '../gares/entities/gare.entity';
import { Vehicule } from '../vehicules/entities/vehicule.entity';
import { Chauffeur } from '../chauffeurs/entities/chauffeur.entity';
import { Fiche } from '../fiches/entities/fiche.entity';

@Injectable()
export class DashboardStatsService {
  constructor(
    @InjectRepository(Utilisateur)
    private readonly utilisateurRepo: Repository<Utilisateur>,

    @InjectRepository(Gare)
    private readonly gareRepo: Repository<Gare>,

    @InjectRepository(Vehicule)
    private readonly vehiculeRepo: Repository<Vehicule>,

    @InjectRepository(Chauffeur)
    private readonly chauffeurRepo: Repository<Chauffeur>,

    @InjectRepository(Fiche)
    private readonly ficheRepo: Repository<Fiche>,
  ) {}

  async getStatsForUser(user: {
    id: number;
    username: string;
    role: string;
    gareId: string | null;
  }) {
    // 1. Statistiques globales
    if (
      user.role === 'ADMIN' ||
      user.role === 'AUTORITE_HABILITEE'
    ) {
      const [
        utilisateurs,
        gares,
        vehicules,
        chauffeurs,
        fiches,
      ] = await Promise.all([
        this.utilisateurRepo.count(),
        this.gareRepo.count(),
        this.vehiculeRepo.count(),
        this.chauffeurRepo.count(),
        this.ficheRepo.count(),
      ]);

      return {
        isGlobal: true,
        utilisateurs,
        gares,
        vehicules,
        chauffeurs,
        fiches,
      };
    }

    // 2. Les autres rôles doivent avoir une gare
    if (!user.gareId) {
      throw new ForbiddenException(
        "Aucune gare n'est assignée à votre compte.",
      );
    }

    // 3. Autoriser uniquement les rôles prévus
    const rolesParGare = [
      'AGENT',
      'CONTROLEUR',
      'RESPONSABLE_GARE',
    ];

    if (!rolesParGare.includes(user.role)) {
      throw new ForbiddenException(
        "Votre rôle ne permet pas de consulter ces statistiques.",
      );
    }

    // 4. Compter les données de la gare
    const gareId = user.gareId;

    const [
      utilisateurs,
      fiches,
      vehicules,
      chauffeurs,
    ] = await Promise.all([
      this.utilisateurRepo.count({
        where: { gareId },
      }),

      this.ficheRepo.count({
        where: { gareId },
      }),

      this.ficheRepo
        .createQueryBuilder('fiche')
        .select('COUNT(DISTINCT fiche.vehiculeId)', 'total')
        .where('fiche.gareId = :gareId', { gareId })
        .getRawOne<{ total: string }>(),

      this.ficheRepo
        .createQueryBuilder('fiche')
        .select('COUNT(DISTINCT fiche.chauffeurId)', 'total')
        .where('fiche.gareId = :gareId', { gareId })
        .getRawOne<{ total: string }>(),
    ]);

    return {
      isGlobal: false,
      utilisateurs,
      gares: 1,
      vehicules: Number(vehicules?.total ?? 0),
      chauffeurs: Number(chauffeurs?.total ?? 0),
      fiches,
    };
  }
}
