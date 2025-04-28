import { Controller, Get, Post, Put, Body, Param, UseGuards, Req, Headers, BadRequestException } from '@nestjs/common';
import { KpiService } from './kpi.service';
import { CalificarKpiDto } from './dto/calificar-kpi.dto';
import { AprobarKpiDto } from './dto/aprobar-kpi.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('KPI Management')
@ApiBearerAuth()
@Controller('kpi')
@UseGuards(JwtAuthGuard, RolesGuard)
export class KpiController {
  constructor(private readonly kpiService: KpiService) {}

  @Post('sync-headcount')
  @Roles('admin')
  @ApiOperation({ summary: 'Sincronizar KPIs' })
  async syncFromHeadcount() {
    return this.kpiService.syncFromHeadcount();
  }

  @Put('calificar/:cedula')
async calificar(
  @Param('cedula') cedula: string,
  @Body() dto: { calificacionKPI: number; observaciones: string }, 
  @Headers() headers: Record<string, string>
) {
  if (!dto.calificacionKPI) {
    throw new BadRequestException('El campo calificacionKPI es requerido');
  }
  return this.kpiService.calificar(cedula, dto.calificacionKPI, dto.observaciones, headers);
}

  @Put('aprobar/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Aprobar/Rechazar KPI' })
  async aprobar(
    @Param('id') id: number,
    @Body() dto: AprobarKpiDto
  ) {
    return this.kpiService.procesarAprobacion(id, dto);
  }
}