import { Module } from '@nestjs/common';
import { TestRolesController } from './test-roles.controller';

@Module({
  controllers: [TestRolesController]
})
export class TestRolesModule {}
