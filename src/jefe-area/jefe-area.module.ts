import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JefeArea } from './entities/jefe-area.entity';
import { JefeAreaController } from './controllers/jefe-area.controller';
import { JefeAreaService } from './services/jefe-area.service';

@Module({
  imports: [TypeOrmModule.forFeature([JefeArea])],
  controllers: [JefeAreaController],
  providers: [JefeAreaService],
})
export class JefeAreaModule {}
