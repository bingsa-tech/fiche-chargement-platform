import { Test, TestingModule } from '@nestjs/testing';

import { ItinerairesController } from './itineraires.controller';
import { ItinerairesService } from './itineraires.service';

describe('ItinerairesController', () => {
  let controller: ItinerairesController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [ItinerairesController],
        providers: [
          {
            provide: ItinerairesService,
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

    controller = module.get<ItinerairesController>(
      ItinerairesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});