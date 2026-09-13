import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GaresService } from './gares.service';
import { Gare } from './entities/gare.entity';

describe('GaresService', () => {
  let service: GaresService;
  let repository: jest.Mocked<Partial<Repository<Gare>>>;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GaresService,
        {
          provide: getRepositoryToken(Gare),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<GaresService>(GaresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
