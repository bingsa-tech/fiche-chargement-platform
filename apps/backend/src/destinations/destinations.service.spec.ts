import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DestinationsService } from './destinations.service';
import { Destination } from './entities/destination.entity';

describe('DestinationsService', () => {
  let service: DestinationsService;
  let repository: jest.Mocked<Partial<Repository<Destination>>>;

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
          DestinationsService,
          {
            provide: getRepositoryToken(Destination),
            useValue: repository,
          },
        ],
      }).compile();

    service = module.get<DestinationsService>(
      DestinationsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});