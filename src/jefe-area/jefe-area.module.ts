import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JefeArea } from './entities/jefe-area.entity';
import { JefeAreaController } from './controllers/jefe-area.controller';
import { JefeAreaService } from './services/jefe-area.service';
import { KPI } from '../kpi/entities/kpi.entity';
import { KpiModule } from '../kpi/kpi.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JefeArea, KPI]),
    KpiModule,
  ],
  controllers: [JefeAreaController],
  providers: [JefeAreaService],
})
export class JefeAreaModule {}
