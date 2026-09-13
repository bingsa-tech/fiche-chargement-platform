import { Test, TestingModule } from '@nestjs/testing';
import { ItinerairesService } from './itineraires.service';

describe('ItinerairesService', () => {
  let service: ItinerairesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItinerairesService],
    }).compile();

    service = module.get<ItinerairesService>(ItinerairesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
