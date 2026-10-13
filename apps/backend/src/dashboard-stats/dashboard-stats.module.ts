import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardStatsController } from './dashboard-stats.controller';
import { DashboardStatsService } from './dashboard-stats.service';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';
import { Gare } from '../gares/entities/gare.entity';
import { Vehicule } from '../vehicules/entities/vehicule.entity';
import { Chauffeur } from '../chauffeurs/entities/chauffeur.entity';
import { Fiche } from '../fiches/entities/fiche.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Utilisateur, Gare, Vehicule, Chauffeur, Fiche]),
  ],
  controllers: [DashboardStatsController],
  providers: [DashboardStatsService],
})
export class DashboardStatsModule {}