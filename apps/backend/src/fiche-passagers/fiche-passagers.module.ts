
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Fiche } from '../fiches/entities/fiche.entity';
import { FichePassager } from './entities/fiche-passager.entity';
import { FichePassagersController } from './fiche-passagers.controller';
import { FichePassagersService } from './fiche-passagers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Fiche,
      FichePassager,
    ]),
  ],
  controllers: [FichePassagersController],
  providers: [FichePassagersService],
  exports: [FichePassagersService],
})
export class FichePassagersModule {}
