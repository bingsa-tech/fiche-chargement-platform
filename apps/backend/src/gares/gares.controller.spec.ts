import { Test, TestingModule } from '@nestjs/testing';

import { GaresController } from './gares.controller';
import { GaresService } from './gares.service';

describe('GaresController', () => {
  let controller: GaresController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [GaresController],
        providers: [
          {
            provide: GaresService,
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

    controller = module.get<GaresController>(
      GaresController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});