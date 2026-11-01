import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlertesController } from './alertes.controller';
import { AlertesService } from './alertes.service';
import { AlertesGenerationService } from './alertes-generation.service';

import { AlerteDocument } from './entities/alerte-document.entity';
import { DocumentChauffeur } from '../documents/entities/document-chauffeur.entity';
import { DocumentVehicule } from '../documents/entities/document-vehicule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AlerteDocument,
      DocumentChauffeur,
      DocumentVehicule,
    ]),
  ],
  controllers: [AlertesController],
  providers: [AlertesService, AlertesGenerationService],
  exports: [AlertesService, AlertesGenerationService],
})
export class AlertesModule {}