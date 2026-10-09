
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProprietairesService } from './proprietaires.service';
import { Proprietaire } from './entities/proprietaire.entity';

describe('ProprietairesService', () => {
  let service: ProprietairesService;

  const repositoryMock: Partial<Repository<Proprietaire>> = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProprietairesService,
        {
          provide: getRepositoryToken(Proprietaire),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<ProprietairesService>(ProprietairesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
