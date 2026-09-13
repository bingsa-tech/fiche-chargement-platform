import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AlertesService } from './alertes.service';
import { AlerteDocument } from './entities/alerte-document.entity';

describe('AlertesService', () => {
  let service: AlertesService;
  let repository: jest.Mocked<
    Partial<Repository<AlerteDocument>>
  >;

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
          AlertesService,
          {
            provide: getRepositoryToken(AlerteDocument),
            useValue: repository,
          },
        ],
      }).compile();

    service = module.get<AlertesService>(
      AlertesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});