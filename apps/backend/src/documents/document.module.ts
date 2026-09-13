import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentsController } from './document.controller';
import { DocumentsService } from './document.service';

import { DocumentVehicule } from './entities/document-vehicule.entity';
import { DocumentChauffeur } from './entities/document-chauffeur.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DocumentVehicule,
      DocumentChauffeur,
    ]),
  ],

  controllers: [
    DocumentsController,
  ],

  providers: [
    DocumentsService,
  ],

  exports: [
    DocumentsService,
  ],
})
export class DocumentsModule {}