import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { VehiculesService } from './vehicules.service';
import { Vehicule } from './entities/vehicule.entity';

describe('VehiculesService', () => {
  let service: VehiculesService;
  let repository: jest.Mocked<Partial<Repository<Vehicule>>>;

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
          VehiculesService,
          {
            provide: getRepositoryToken(Vehicule),
            useValue: repository,
          },
        ],
      }).compile();

    service = module.get<VehiculesService>(
      VehiculesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});