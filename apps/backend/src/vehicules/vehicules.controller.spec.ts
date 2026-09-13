import { Test, TestingModule } from '@nestjs/testing';

import { VehiculesController } from './vehicules.controller';
import { VehiculesService } from './vehicules.service';

describe('VehiculesController', () => {
  let controller: VehiculesController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [VehiculesController],
        providers: [
          {
            provide: VehiculesService,
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

    controller = module.get<VehiculesController>(
      VehiculesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});