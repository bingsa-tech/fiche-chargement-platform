import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChauffeursController } from './chauffeurs.controller';
import { ChauffeursService } from './chauffeurs.service';
import { Chauffeur } from './entities/chauffeur.entity';
import { DocumentChauffeur } from '../documents/entities/document-chauffeur.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Chauffeur,
      DocumentChauffeur,
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