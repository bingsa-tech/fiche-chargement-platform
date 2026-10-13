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
    private readonly ficheRepo: Repository<Fiche>
  ) {}

  async getStatsForUser(user: {
  id: number;
  username: string;
  role: string;
  gareId: string | null;
}) {
  // Statistiques globales réservées aux rôles autorisés.
  if (
    user.role === 'ADMIN' ||
    user.role === 'AUTORITE_HABILITEE'
  ) {
    const [
      utilisateurs,
      gares,
      vehicules,
      chauffeurs,
      fiches
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
      fiches
    };
  }

  // Les autres rôles nécessitent une gare affectée.
  if (!user.gareId) {
    throw new ForbiddenException(
      "Aucune gare n'est assignée à votre compte pour afficher les statistiques.",
    );
  }

  // Ne pas retourner de faux chiffres :
  // les filtres par gare doivent être implémentés
  // selon les relations réelles des entités.
  throw new ForbiddenException(
    "Les statistiques filtrées par gare ne sont pas encore configurées.",
  );
}}