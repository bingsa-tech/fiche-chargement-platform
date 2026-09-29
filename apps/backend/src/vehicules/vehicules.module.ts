import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proprietaire } from '../proprietaires/entities/proprietaire.entity';
import { VehiculesController } from './vehicules.controller';
import { VehiculesService } from './vehicules.service';
import { Vehicule } from './entities/vehicule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicule, Proprietaire]),
  ],
  controllers: [VehiculesController],
  providers: [VehiculesService],
  exports: [VehiculesService],
})
export class VehiculesModule {}