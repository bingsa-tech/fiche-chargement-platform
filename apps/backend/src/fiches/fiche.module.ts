import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Fiche } from './entities/fiche.entity';
import { FicheController } from './fiche.controller';
import { FicheService } from './fiche.service';
import { FicheImpressionsModule } from '../fiche-impressions/fiche-impressions.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Fiche]),
    FicheImpressionsModule,
  ],
  controllers: [FicheController],
  providers: [FicheService],
  exports: [FicheService],
})
export class FicheModule {}
