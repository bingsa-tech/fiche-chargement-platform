import { Test, TestingModule } from '@nestjs/testing';

import { ProprietairesController } from './proprietaires.controller';
import { ProprietairesService } from './proprietaires.service';

describe('ProprietairesController', () => {
  let controller: ProprietairesController;

  const proprietairesServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProprietairesController],
      providers: [
        {
          provide: ProprietairesService,
          useValue: proprietairesServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ProprietairesController>(
      ProprietairesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});