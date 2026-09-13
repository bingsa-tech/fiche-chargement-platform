import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChauffeursService } from './chauffeurs.service';
import { Chauffeur } from './entities/chauffeur.entity';

describe('ChauffeursService', () => {
  let service: ChauffeursService;
  let repository: jest.Mocked<Partial<Repository<Chauffeur>>>;

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
          ChauffeursService,
          {
            provide: getRepositoryToken(Chauffeur),
            useValue: repository,
          },
        ],
      }).compile();

    service = module.get<ChauffeursService>(
      ChauffeursService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});