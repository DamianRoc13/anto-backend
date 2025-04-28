import { Injectable, Inject, forwardRef, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { KPI } from './entities/kpi.entity';
import { Headcount } from '../headcount/entities/headcount.entity';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { Request } from 'express';
import { AprobarKpiDto } from './dto/aprobar-kpi.dto';

@Injectable()
export class KpiService {
  constructor(
    @InjectRepository(KPI)
    private kpiRepository: Repository<KPI>,
    @InjectRepository(Headcount)
    private headcountRepository: Repository<Headcount>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService
  ) {}

  procesarAprobacion(id: number, dto: AprobarKpiDto): any {
    return { message: `KPI with ID ${id} processed successfully`, data: dto };
  }

  async syncFromHeadcount(): Promise<{ updated: number }> {
    const headcounts = await this.headcountRepository.find({ 
      where: { kpi: MoreThan(0) }
    });
  
    let updated = 0;
    for (const hc of headcounts) {
      await this.kpiRepository.upsert(
        {
          cedula: hc.cedula,
          nombre: hc.nombre,
          cargoActividad: hc.cargoActividad,
          sueldo: hc.sueldo,
          kpi: hc.kpi,
          grupoCentrosCostos: hc.grupoCentrosCostos || 'Sin grupo', 
          calificacionKPI: 0,
          totalKPI: 0,
          observaciones: '',
          estado: 'pendiente',
          usuarioCalificador: 'sistema',
          fechaCalificacion: new Date()
        },
        ['cedula']
      );
      updated++;
    }
    return { updated };
  }
  
  async calificar(
    cedula: string,
    calificacionKPI: number,
    observaciones: string,
    headers: Record<string, string>
  ): Promise<KPI> {
   
    if (isNaN(calificacionKPI)) {
      throw new BadRequestException('calificacionKPI debe ser un número');
    }

    if (calificacionKPI < 0 || calificacionKPI > 300) {
      throw new BadRequestException('La calificación debe estar entre 0 y 300');
    }

    
    const usuario = await this.authService.getUsuarioActual(headers);

    
    const kpi = await this.kpiRepository.findOne({ where: { cedula } });
    if (!kpi) {
      throw new NotFoundException(`No se encontró KPI para la cédula ${cedula}`);
    }

    
    kpi.calificacionKPI = calificacionKPI;
    kpi.totalKPI = (kpi.kpi * calificacionKPI) / 100;
    kpi.observaciones = observaciones;
    kpi.usuarioCalificador = usuario.nombre;
    kpi.fechaCalificacion = new Date();

    return this.kpiRepository.save(kpi);
  }
}
