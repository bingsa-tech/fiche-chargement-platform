import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProprietairesController } from './proprietaires.controller';
import { ProprietairesService } from './proprietaires.service';
import { Proprietaire } from './entities/proprietaire.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Proprietaire]),
  ],
  controllers: [ProprietairesController],
  providers: [ProprietairesService],
  exports: [ProprietairesService],
})
export class ProprietairesModule {}