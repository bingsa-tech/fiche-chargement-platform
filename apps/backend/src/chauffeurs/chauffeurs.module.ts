
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChauffeursController } from './chauffeurs.controller';
import { ChauffeursService } from './chauffeurs.service';
import { Chauffeur } from './entities/chauffeur.entity';
import { DocumentChauffeur } from '../documents/entities/document-chauffeur.entity';
import { Gare } from '../gares/entities/gare.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Chauffeur,
      DocumentChauffeur,
      Gare,
    ]),
  ],
  controllers: [
    ChauffeursController,
  ],
  providers: [
    ChauffeursService,
  ],
  exports: [
    ChauffeursService,
  ],
})
export class ChauffeursModule {}
