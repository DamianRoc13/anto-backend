import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KpiController } from './kpi.controller';
import { KpiService } from './kpi.service';
import { KPI } from './entities/kpi.entity';
import { Headcount } from '../headcount/entities/headcount.entity';
import { AuthModule } from '../auth/auth.module';
import { CommitKpi } from './entities/commit-kpi.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([KPI, Headcount, CommitKpi]),
    AuthModule,
  ],
  controllers: [KpiController],
  providers: [KpiService],
})
export class KpiModule {}