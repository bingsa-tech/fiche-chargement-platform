import { Test, TestingModule } from '@nestjs/testing';

import { ChauffeursController } from './chauffeurs.controller';
import { ChauffeursService } from './chauffeurs.service';

describe('ChauffeursController', () => {
  let controller: ChauffeursController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [ChauffeursController],
        providers: [
          {
            provide: ChauffeursService,
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

    controller = module.get<ChauffeursController>(
      ChauffeursController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});