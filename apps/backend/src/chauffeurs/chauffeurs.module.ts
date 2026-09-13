import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChauffeursController } from './chauffeurs.controller';
import { ChauffeursService } from './chauffeurs.service';
import { Chauffeur } from './entities/chauffeur.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([Chauffeur]),
         ],
  controllers: [ChauffeursController],
  providers: [ChauffeursService]
})
export class ChauffeursModule {}
