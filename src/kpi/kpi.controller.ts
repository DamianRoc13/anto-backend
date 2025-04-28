import { Controller, Get, Post, Put, Body, Param, UseGuards, Req, Headers, BadRequestException } from '@nestjs/common';
import { KpiService } from './kpi.service';
import { CalificarKpiDto } from './dto/calificar-kpi.dto';
import { AprobarKpiDto } from './dto/aprobar-kpi.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
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
  @ApiOperation({ 
    summary: 'Calificar un empleado', 
    description: 'Endpoint para asignar una calificación KPI a un empleado específico' 
  })
  @ApiParam({
    name: 'cedula',
    type: String,
    description: 'Cédula del empleado a calificar',
    example: '0921611760'
  })
  @ApiBody({ 
    type: CalificarKpiDto,
    examples: {
      ejemplo1: {
        summary: 'Calificación básica',
        value: { calificacionKPI: 250 }
      },
      ejemplo2: {
        summary: 'Calificación con observaciones',
        value: { calificacionKPI: 280, observaciones: "Superó expectativas" }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Calificación registrada exitosamente' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos inválidos o calificación fuera de rango (0-300)' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Empleado no encontrado' 
  })
  async calificar(
    @Param('cedula') cedula: string,
    @Body() dto: CalificarKpiDto,
    @Headers() headers: Record<string, string>
  ) {
    return this.kpiService.calificar(
      cedula,
      dto.calificacionKPI,
      dto.observaciones || '',
      headers
    );
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