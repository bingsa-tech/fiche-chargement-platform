import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FichePassagersService } from './fiche-passagers.service';
import { FichePassager } from './entities/fiche-passager.entity';

describe('FichePassagersService', () => {
  let service: FichePassagersService;
  let repository: jest.Mocked<Partial<Repository<FichePassager>>>;

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
          FichePassagersService,
          {
            provide: getRepositoryToken(FichePassager),
            useValue: repository,
          },
        ],
      }).compile();

    service = module.get<FichePassagersService>(
      FichePassagersService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});