import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GaresController } from './gares.controller';
import { GaresService } from './gares.service';
import { Gare } from './entities/gare.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gare]),
  ],
  controllers: [GaresController],
  providers: [GaresService],
  exports: [GaresService],
})
export class GaresModule {}