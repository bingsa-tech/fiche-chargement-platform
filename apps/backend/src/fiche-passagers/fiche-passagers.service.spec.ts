
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FichePassagersService } from './fiche-passagers.service';
import { FichePassager } from './entities/fiche-passager.entity';
import { Fiche } from '../fiches/entities/fiche.entity';

describe('FichePassagersService', () => {
  let service: FichePassagersService;
  let fichePassagerRepository: jest.Mocked<
    Partial<Repository<FichePassager>>
  >;
  let ficheRepository: jest.Mocked<Partial<Repository<Fiche>>>;

  beforeEach(async () => {
    fichePassagerRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    ficheRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FichePassagersService,
        {
          provide: getRepositoryToken(FichePassager),
          useValue: fichePassagerRepository,
        },
        {
          provide: getRepositoryToken(Fiche),
          useValue: ficheRepository,
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
