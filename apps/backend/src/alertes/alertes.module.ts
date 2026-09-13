import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlertesController } from './alertes.controller';
import { AlertesService } from './alertes.service';
import { AlerteDocument } from './entities/alerte-document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AlerteDocument,
    ]),
  ],
  controllers: [
    AlertesController,
  ],
  providers: [
    AlertesService,
  ],
  exports: [
    AlertesService,
  ],
})
export class AlertesModule {}