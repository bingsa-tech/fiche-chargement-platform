import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';

describe('RolesService', () => {
  let service: RolesService;
  let repository: jest.Mocked<Partial<Repository<Role>>>;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          RolesService,
          {
            provide: getRepositoryToken(Role),
            useValue: repository,
          },
        ],
      }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});