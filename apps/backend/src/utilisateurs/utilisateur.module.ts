import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Utilisateur } from './entities/utilisateur.entity';
import { Role } from '../roles/entities/role.entity';
import { Gare } from '../gares/entities/gare.entity';

import { UtilisateursController } from './utilisateur.controller';
import { UtilisateursService } from './utilisateur.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Utilisateur,
      Role,
      Gare,
    ]),
  ],
  controllers: [
    UtilisateursController,
  ],
  providers: [
    UtilisateursService,
  ],
  exports: [
    UtilisateursService,
  ],
})
export class UtilisateursModule {}