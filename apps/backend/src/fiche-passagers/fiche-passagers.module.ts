import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FichePassager } from './entities/fiche-passager.entity';
import { FichePassagersController } from './fiche-passagers.controller';
import { FichePassagersService } from './fiche-passagers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FichePassager,
    ]),
  ],
  controllers: [
    FichePassagersController,
  ],
  providers: [
    FichePassagersService,
  ],
  exports: [
    FichePassagersService,
  ],
})
export class FichePassagersModule {}