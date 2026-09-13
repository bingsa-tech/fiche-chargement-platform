import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Itineraire } from './entities/itineraire.entity';
import { ItinerairesController } from './itineraires.controller';
import { ItinerairesService } from './itineraires.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Itineraire,
    ]),
  ],
  controllers: [
    ItinerairesController,
  ],
  providers: [
    ItinerairesService,
  ],
  exports: [
    ItinerairesService,
  ],
})
export class ItinerairesModule {}