
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Passager } from './entities/passager.entity';
import { PassagersController } from './passagers.controller';
import { PassagersService } from './passagers.service';

import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Passager]),
    AuditModule,
  ],
  controllers: [
    PassagersController,
  ],
  providers: [
    PassagersService,
  ],
  exports: [
    PassagersService,
  ],
})
export class PassagersModule {}
