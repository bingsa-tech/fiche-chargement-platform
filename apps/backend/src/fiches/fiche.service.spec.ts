import { Test, TestingModule } from '@nestjs/testing';
import { FicheService } from './fiche.service';

describe('FicheService', () => {
  let service: FicheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FicheService],
    }).compile();

    service = module.get<FicheService>(FicheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
