import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JefeArea } from '../entities/jefe-area.entity';
import { CreateJefeAreaDto } from '../dto/create-jefe-area.dto';
import { KPI } from '../../kpi/entities/kpi.entity';

@Injectable()
export class JefeAreaService {
  constructor(
    @InjectRepository(JefeArea)
    private readonly jefeAreaRepository: Repository<JefeArea>,
    @InjectRepository(KPI)
    private readonly kpiRepository: Repository<KPI>,
  ) {}

  async create(createJefeAreaDto: CreateJefeAreaDto): Promise<JefeArea> {
    const jefeArea = this.jefeAreaRepository.create(createJefeAreaDto);
    return this.jefeAreaRepository.save(jefeArea);
  }

  async findAll(): Promise<JefeArea[]> {
    return this.jefeAreaRepository.find();
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.jefeAreaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Jefe de área con id ${id} no encontrado.`);
    }
    return { message: `Jefe de área con id ${id} eliminado exitosamente.` };
  }

  async assignKpis(jefeAreaId: string, kpiIds: string[]): Promise<{ message: string }> {
    const jefeArea = await this.jefeAreaRepository.findOne({ where: { id: jefeAreaId } });
    if (!jefeArea) {
      throw new NotFoundException(`Jefe de área con id ${jefeAreaId} no encontrado.`);
    }

    const kpis = await this.kpiRepository.findByIds(kpiIds);
    kpis.forEach((kpi) => {
      kpi.jefeArea = jefeArea;
    });
    await this.kpiRepository.save(kpis);

    return { message: `KPI(s) asignados exitosamente al jefe de área con id ${jefeAreaId}.` };
  }

  async removeKpis(jefeAreaId: string, kpiIds: string[]): Promise<{ message: string }> {
    const kpis = await this.kpiRepository.findByIds(kpiIds);
    kpis.forEach((kpi) => {
      if (kpi.jefeArea && kpi.jefeArea.id === jefeAreaId) {
        kpi.jefeArea = null;
      }
    });
    await this.kpiRepository.save(kpis);

    return { message: `KPI(s) removidos exitosamente del jefe de área con id ${jefeAreaId}.` };
  }
}
