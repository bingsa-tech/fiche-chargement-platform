import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PresenceSession } from './entities/presence-session.entity';
import { PresenceService } from './presence.service';
import { PresenceController } from './presence.controller';
import { Utilisateur } from '../utilisateurs/entities/utilisateur.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PresenceSession,
      Utilisateur,
    ]),
  ],
  controllers: [
    PresenceController,
  ],
  providers: [
    PresenceService,
  ],
  exports: [
    PresenceService,
  ],
})
export class PresenceModule {}