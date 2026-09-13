import { Test, TestingModule } from '@nestjs/testing';
import { ItinerairesController } from './itineraires.controller';

describe('ItinerairesController', () => {
  let controller: ItinerairesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItinerairesController],
    }).compile();

    controller = module.get<ItinerairesController>(ItinerairesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
