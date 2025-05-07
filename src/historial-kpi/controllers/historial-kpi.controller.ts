import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
import { HistorialKpiService } from '../services/historial-kpi.service';
import { CreateHistorialKpiDto } from '../dto/create-historial-kpi.dto';
import { ResponseHistorialKpiDto } from '../dto/response-historial-kpi.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@ApiTags('HistorialKpi')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('historial-kpi')
export class HistorialKpiController {
  constructor(private readonly historialKpiService: HistorialKpiService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({
    status: 201,
    description: 'Historial de KPI creado exitosamente.',
    type: ResponseHistorialKpiDto,
  })
  async create(@Body() createHistorialKpiDto: CreateHistorialKpiDto, @Req() req: Request) {
    return this.historialKpiService.create(createHistorialKpiDto, req);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lista de todos los historiales de KPI.',
    type: [ResponseHistorialKpiDto],
  })
  async findAll() {
    return this.historialKpiService.findAll();
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'ID del historial de KPI a eliminar',
    example: 'uuid-generado',
  })
  @ApiResponse({
    status: 200,
    description: 'Historial de KPI eliminado exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Historial de KPI no encontrado.',
  })
  async delete(@Param('id') id: string) {
    return this.historialKpiService.delete(id);
  }
}
