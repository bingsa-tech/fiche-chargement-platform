import { Test, TestingModule } from '@nestjs/testing';

import { PassagersController } from './passagers.controller';
import { PassagersService } from './passagers.service';

describe('PassagersController', () => {
  let controller: PassagersController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [PassagersController],
        providers: [
          {
            provide: PassagersService,
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

    controller = module.get<PassagersController>(
      PassagersController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});