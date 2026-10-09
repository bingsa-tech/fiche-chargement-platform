import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { ChauffeursService } from './chauffeurs.service';
import { Chauffeur } from './entities/chauffeur.entity';

describe('ChauffeursService', () => {
  let service: ChauffeursService;

  const chauffeurRepository: Partial<jest.Mocked<Repository<Chauffeur>>> = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const dataSourceMock = {
    transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChauffeursService,
        {
          provide: getRepositoryToken(Chauffeur),
          useValue: chauffeurRepository,
        },
        {
          provide: DataSource,
          useValue: dataSourceMock,
        },
      ],
    }).compile();

    service = module.get<ChauffeursService>(ChauffeursService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});