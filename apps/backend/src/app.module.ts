import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ChauffeursModule } from './chauffeurs/chauffeurs.module';
import { VehiculesModule } from './vehicules/vehicules.module';
import { DocumentsModule } from './documents/document.module';
import { AlertesModule } from './alertes/alertes.module';
import { GaresModule } from './gares/gares.module';
import { FicheModule } from './fiches/fiche.module';
import { UtilisateursModule } from './utilisateurs/utilisateur.module';
import { RolesModule } from './roles/roles.module';
import { DestinationsModule } from './destinations/destinations.module';
import { ItinerairesModule } from './itineraires/itineraires.module';
import { FichePassagersModule } from './fiche-passagers/fiche-passagers.module';
import { PassagersModule } from './passagers/passagers.module';
import { TestRolesModule } from './test-roles/test-roles.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'db_fiche_chargement',
      logging: true,
      autoLoadEntities: true,
      synchronize: false,

    }),
    AuthModule,
    ChauffeursModule,
    VehiculesModule,
    DocumentsModule,
    AlertesModule,
    GaresModule,
    FicheModule,
    UtilisateursModule,
    RolesModule,
    DestinationsModule,
    ItinerairesModule,
    FichePassagersModule,
    PassagersModule,
    TestRolesModule,
  ],
})
export class AppModule {}