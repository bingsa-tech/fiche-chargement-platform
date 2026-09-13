import { Test, TestingModule } from '@nestjs/testing';
import { PassagersService } from './passagers.service';

describe('PassagersService', () => {
  let service: PassagersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PassagersService],
    }).compile();

    service = module.get<PassagersService>(PassagersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
