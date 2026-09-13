import { Test, TestingModule } from '@nestjs/testing';
import { PassagersController } from './passagers.controller';

describe('PassagersController', () => {
  let controller: PassagersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassagersController],
    }).compile();

    controller = module.get<PassagersController>(PassagersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
