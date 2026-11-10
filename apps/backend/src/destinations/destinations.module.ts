
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Destination } from './entities/destination.entity';
import { DestinationsController } from './destinations.controller';
import { DestinationsService } from './destinations.service';

import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Destination,
    ]),
    AuditModule,
  ],
  controllers: [
    DestinationsController,
  ],
  providers: [
    DestinationsService,
  ],
  exports: [
    DestinationsService,
  ],
})
export class DestinationsModule {}
