import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';
import { Gare } from '../gares/entities/gare.entity';
import { Vehicule } from '../vehicules/entities/vehicule.entity';
import { Chauffeur } from '../chauffeurs/entities/chauffeur.entity';

@Injectable()
export class DashboardStatsService {
  constructor(
    @InjectRepository(Utilisateur) private utilisateurRepo: Repository<Utilisateur>,
    @InjectRepository(Gare) private gareRepo: Repository<Gare>,
    @InjectRepository(Vehicule) private vehiculeRepo: Repository<Vehicule>,
    @InjectRepository(Chauffeur) private chauffeurRepo: Repository<Chauffeur>,
  ) {}

  async getStatsForUser(user: any) {
    const roleId = user.role_id;
    const gareId = user.gare_id;

    // 1. Si c'est un ADMIN (1) ou une AUTORITÉ HABILITÉE (8) : Stats Globales
    if (roleId === 1 || roleId === 8) {
      const [utilisateurs, gares, vehicules, chauffeurs] = await Promise.all([
        this.utilisateurRepo.count(),
        this.gareRepo.count(),
        this.vehiculeRepo.count(),
        this.chauffeurRepo.count(),
      ]);

      return {
        isGlobal: true,
        utilisateurs,
        gares,
        vehicules,
        chauffeurs,
      };
    }

    // 2. Pour les rôles rattachés à une gare (Responsable de gare, Contrôleur, Agent)
    if (!gareId) {
      throw new ForbiddenException("Aucune gare n'est assignée à votre compte pour afficher les statistiques.");
    }

    // Statistiques filtrées par la gare de l'utilisateur
    // (Note : Ajustez la relation selon la structure exacte de vos entités TypeORM, ex: vehicule.gare ou propriétaire lié à la gare)
    const [vehiculesGare, chauffeursGare] = await Promise.all([
      this.vehiculeRepo.count({ where: { /* adaptez selon votre entité, ex: gare: { id: gareId } */ } }),
      // S'il y a un lien direct ou indirect avec la gare, filtrez ici
      this.chauffeurRepo.count(), 
    ]);

    return {
      isGlobal: false,
      gareId,
      vehicules: vehiculesGare,
      chauffeurs: chauffeursGare,
      // Vous pouvez ajouter d'autres indicateurs propres à sa gare (fiches de chargement du jour, etc.)
    };
  }
}