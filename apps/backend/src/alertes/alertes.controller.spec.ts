import { Test, TestingModule } from '@nestjs/testing';

import { AlertesController } from './alertes.controller';
import { AlertesService } from './alertes.service';

describe('AlertesController', () => {
  let controller: AlertesController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [AlertesController],
        providers: [
          {
            provide: AlertesService,
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

    controller = module.get<AlertesController>(
      AlertesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});