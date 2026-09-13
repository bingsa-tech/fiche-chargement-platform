import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Fiche } from './entities/fiche.entity';
import { FicheController } from './fiche.controller';
import { FicheService } from './fiche.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fiche]),
  ],
  controllers: [FicheController],
  providers: [FicheService],
  exports: [FicheService],
})
export class FicheModule {}
