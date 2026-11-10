
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Fiche } from './entities/fiche.entity';
import { FicheController } from './fiche.controller';
import { FicheService } from './fiche.service';
import { FicheImpressionsModule } from '../fiche-impressions/fiche-impressions.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fiche]),
    FicheImpressionsModule,
    AuditModule,
  ],
  controllers: [FicheController],
  providers: [FicheService],
  exports: [FicheService],
})
export class FicheModule {}
