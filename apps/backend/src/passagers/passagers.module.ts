import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Passager } from './entities/passager.entity';
import { PassagersController } from './passagers.controller';
import { PassagersService } from './passagers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Passager]),
  ],
  controllers: [PassagersController],
  providers: [PassagersService],
  exports: [PassagersService],
})
export class PassagersModule {}