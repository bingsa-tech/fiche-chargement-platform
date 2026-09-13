import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PassagersService } from './passagers.service';
import { Passager } from './entities/passager.entity';

describe('PassagersService', () => {
  let service: PassagersService;
  let repository: jest.Mocked<Partial<Repository<Passager>>>;

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
          PassagersService,
          {
            provide: getRepositoryToken(Passager),
            useValue: repository,
          },
        ],
      }).compile();

    service = module.get<PassagersService>(
      PassagersService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});