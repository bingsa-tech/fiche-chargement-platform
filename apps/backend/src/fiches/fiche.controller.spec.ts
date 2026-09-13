import { Test, TestingModule } from '@nestjs/testing';

import { FicheController } from './fiche.controller';
import { FicheService } from './fiche.service';

describe('FicheController', () => {
  let controller: FicheController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [FicheController],
        providers: [
          {
            provide: FicheService,
            useValue: {
              create: jest.fn(),
              findAll: jest.fn(),
              findOne: jest.fn(),
              update: jest.fn(),
              remove: jest.fn(),
            },
          },
        ],
      }).compile();

    controller = module.get<FicheController>(
      FicheController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});