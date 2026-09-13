import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ItinerairesService } from './itineraires.service';
import { Itineraire } from './entities/itineraire.entity';

describe('ItinerairesService', () => {
  let service: ItinerairesService;
  let repository: jest.Mocked<Partial<Repository<Itineraire>>>;

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
          ItinerairesService,
          {
            provide: getRepositoryToken(Itineraire),
            useValue: repository,
          },
        ],
      }).compile();

    service = module.get<ItinerairesService>(
      ItinerairesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});