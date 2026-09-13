import { Test, TestingModule } from '@nestjs/testing';

import { FichePassagersController } from './fiche-passagers.controller';
import { FichePassagersService } from './fiche-passagers.service';

describe('FichePassagersController', () => {
  let controller: FichePassagersController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [FichePassagersController],
        providers: [
          {
            provide: FichePassagersService,
            useValue: {
              create: jest.fn(),
              findAll: jest.fn(),
              findByFiche: jest.fn(),
              findOne: jest.fn(),
              update: jest.fn(),
              remove: jest.fn(),
            },
          },
        ],
      }).compile();

    controller = module.get<FichePassagersController>(
      FichePassagersController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});