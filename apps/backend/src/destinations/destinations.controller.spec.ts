import { Test, TestingModule } from '@nestjs/testing';

import { DestinationsController } from './destinations.controller';
import { DestinationsService } from './destinations.service';

describe('DestinationsController', () => {
  let controller: DestinationsController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [DestinationsController],
        providers: [
          {
            provide: DestinationsService,
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

    controller = module.get<DestinationsController>(
      DestinationsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});