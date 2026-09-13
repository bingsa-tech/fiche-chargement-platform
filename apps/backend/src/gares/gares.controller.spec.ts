import { Test, TestingModule } from '@nestjs/testing';
import { GaresController } from './gares.controller';

describe('GaresController', () => {
  let controller: GaresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GaresController],
    }).compile();

    controller = module.get<GaresController>(GaresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
