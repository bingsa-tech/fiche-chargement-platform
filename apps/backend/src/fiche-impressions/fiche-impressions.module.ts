import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FicheImpression } from './entities/fiche-impression.entity';
import { FicheImpressionsController } from './fiche-impressions.controller';
import { FicheImpressionsService } from './fiche-impressions.service';

import { Fiche } from '../fiches/entities/fiche.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FicheImpression,
      Fiche,
    ]),
  ],
  controllers: [
    FicheImpressionsController,
  ],
  providers: [
    FicheImpressionsService,
  ],
  exports: [
    FicheImpressionsService,
  ],
})
export class FicheImpressionsModule {}