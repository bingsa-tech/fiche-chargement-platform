import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Proprietaire } from '../proprietaires/entities/proprietaire.entity';
import { DocumentVehicule } from '../documents/entities/document-vehicule.entity';

import { Vehicule } from './entities/vehicule.entity';
import { VehiculesController } from './vehicules.controller';
import { VehiculesService } from './vehicules.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vehicule,
      Proprietaire,
      DocumentVehicule,
    ]),
  ],
  controllers: [VehiculesController],
  providers: [VehiculesService],
  exports: [VehiculesService],
})
export class VehiculesModule {}