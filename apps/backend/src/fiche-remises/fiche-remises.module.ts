import { Module } from '@nestjs/common';
import { FicheRemisesService } from './fiche-remises.service';
import { FicheRemisesController } from './fiche-remises.controller';

@Module({
  controllers: [FicheRemisesController],
  providers: [FicheRemisesService],
})
export class FicheRemisesModule {}
