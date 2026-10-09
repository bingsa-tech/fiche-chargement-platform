import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { VehiculesService } from './vehicules.service';
import { Vehicule } from './entities/vehicule.entity';
import { Proprietaire } from '../proprietaires/entities/proprietaire.entity';

describe('VehiculesService', () => {
  let service: VehiculesService;

  const vehiculeRepository: Partial<jest.Mocked<Repository<Vehicule>>> = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const proprietaireRepository: Partial<
    jest.Mocked<Repository<Proprietaire>>
  > = {
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
        VehiculesService,
        {
          provide: getRepositoryToken(Vehicule),
          useValue: vehiculeRepository,
        },
        {
          provide: getRepositoryToken(Proprietaire),
          useValue: proprietaireRepository,
        },
        {
          provide: DataSource,
          useValue: dataSourceMock,
        },
      ],
    }).compile();

    service = module.get<VehiculesService>(VehiculesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});