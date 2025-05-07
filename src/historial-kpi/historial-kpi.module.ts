import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialKpi } from './entities/historial-kpi.entity';
import { HistorialKpiController } from './controllers/historial-kpi.controller';
import { HistorialKpiService } from './services/historial-kpi.service';
import { KPI } from '../kpi/entities/kpi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialKpi, KPI])],
  controllers: [HistorialKpiController],
  providers: [HistorialKpiService],
})
export class HistorialKpiModule {}
