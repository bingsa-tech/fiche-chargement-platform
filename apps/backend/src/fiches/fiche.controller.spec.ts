import { Test, TestingModule } from '@nestjs/testing';
import { FicheController } from './fiche.controller';

describe('FicheController', () => {
  let controller: FicheController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FicheController],
    }).compile();

    controller = module.get<FicheController>(FicheController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
