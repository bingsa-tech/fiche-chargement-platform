import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

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
import { ProprietairesModule } from './proprietaires/proprietaires.module';
import { FicheImpressionsModule } from './fiche-impressions/fiche-impressions.module';
import { DashboardStatsModule } from './dashboard-stats/dashboard-stats.module';
import { AuditModule } from './audit/audit.module';
import { PresenceModule } from './presence/presence.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
      expandVariables: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT', '6543')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: false,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
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
    ProprietairesModule,
    FicheImpressionsModule,
    DashboardStatsModule,
    AuditModule,
    PresenceModule,
  ],
})
export class AppModule {}
