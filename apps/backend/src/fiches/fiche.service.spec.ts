import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FicheService } from './fiche.service';
import { Fiche } from './entities/fiche.entity';

describe('FicheService', () => {
  let service: FicheService;
  let repository: jest.Mocked<Partial<Repository<Fiche>>>;

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
          FicheService,
          {
            provide: getRepositoryToken(Fiche),
            useValue: repository,
          },
        ],
      }).compile();

    service = module.get<FicheService>(FicheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});