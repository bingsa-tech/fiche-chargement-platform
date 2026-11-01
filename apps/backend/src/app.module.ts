import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { ProprietairesModule } from './proprietaires/proprietaires.module';
import { FicheImpressionsModule } from './fiche-impressions/fiche-impressions.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DashboardStatsModule } from './dashboard-stats/dashboard-stats.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'B:/projects/fiche-chargement-platform/apps/backend/.env',
      cache: true,
    }),

    /* TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,

        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT', 5432),

        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),

        database: configService.get<string>('DB_DATABASE'),

        logging: true,
        autoLoadEntities: true,

        // IMPORTANT :
        // Le schéma Supabase a déjà été migré et audité.
        // TypeORM ne doit pas le modifier automatiquement.
        synchronize: false,
      }),
    }), */

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env',
  cache: true,
  expandVariables: true,
}),

TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],

  useFactory: (configService: ConfigService) => {
    const host = configService.get<string>('DB_HOST');
    const username = configService.get<string>('DB_USERNAME');
    const password = configService.get<string>('DB_PASSWORD');
    const database = configService.get<string>('DB_DATABASE');

    if (!host || !username || !password || !database) {
      throw new Error(
        'Configuration PostgreSQL incomplète : vérifiez les variables DB_HOST, DB_USERNAME, DB_PASSWORD et DB_DATABASE.',
      );
    }

    return {
      type: 'postgres' as const,
      host,
      port: Number(configService.get<string>('DB_PORT') || 5432),
      username,
      password,
      database,
      logging: true,
      autoLoadEntities: true,
      synchronize: false,
    };
  },
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
    ScheduleModule.forRoot(),
    DashboardStatsModule,
    AuditModule,
  ],
})
export class AppModule {}
