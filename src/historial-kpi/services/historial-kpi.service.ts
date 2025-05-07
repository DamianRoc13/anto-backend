import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialKpi } from '../entities/historial-kpi.entity';
import { CreateHistorialKpiDto } from '../dto/create-historial-kpi.dto';
import { ResponseHistorialKpiDto } from '../dto/response-historial-kpi.dto';
import { KPI } from '../../kpi/entities/kpi.entity';
import { Request } from 'express';

@Injectable()
export class HistorialKpiService {
  constructor(
    @InjectRepository(HistorialKpi)
    private readonly historialKpiRepository: Repository<HistorialKpi>,
    @InjectRepository(KPI)
    private readonly kpiRepository: Repository<KPI>,
  ) {}

  async create(createHistorialKpiDto: CreateHistorialKpiDto, req: Request): Promise<HistorialKpi> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autorización no proporcionado.');
    }

    const tablaKpi = await this.kpiRepository.find();

    const historial = this.historialKpiRepository.create({
      ...createHistorialKpiDto,
      tablaKpi,
    });
    return this.historialKpiRepository.save(historial);
  }

  async findAll(): Promise<ResponseHistorialKpiDto[]> {
    const historiales = await this.historialKpiRepository.find();
    return historiales.map((historial) => ({
      id: historial.id,
      nombre: historial.nombre,
      fechaDe: historial.fechaDe.toISOString().split('T')[0], // Formatea la fecha como YYYY-MM-DD
      fechaHasta: historial.fechaHasta.toISOString().split('T')[0], // Formatea la fecha como YYYY-MM-DD
      guardadoPor: historial.guardadoPor,
      tablaKpi: historial.tablaKpi,
    }));
  }

  async delete(id: string): Promise<{ message: string }> {
    const result = await this.historialKpiRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Historial de KPI con id ${id} no encontrado.`);
    }
    return { message: `Historial de KPI con id ${id} eliminado exitosamente.` };
  }
}
