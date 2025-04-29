import { Controller, Get, Post, Put, Body, Param, UseGuards, Req, Headers, BadRequestException } from '@nestjs/common';
import { KpiService } from './kpi.service';
import { CalificarKpiDto } from './dto/calificar-kpi.dto';
import { AprobarKpiDto } from './dto/aprobar-kpi.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateCommitKpiDto } from './dto/create-commit-kpi.dto';
import { ApproveCommitKpiDto } from './dto/approve-commit-kpi.dto';
import { User } from '@users/user.entity';
import { CommitKpi } from './entities/commit-kpi.entity';
import { KPI } from './entities/kpi.entity';
import { AuthService } from '../auth/auth.service';

@ApiTags('KPI Management')
@ApiBearerAuth()
@Controller('kpi')
@UseGuards(JwtAuthGuard, RolesGuard)
export class KpiController {
  constructor(
    private readonly kpiService: KpiService,
    private readonly authService: AuthService
  ) {}

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

  @Post('commits/:cedula')
@ApiOperation({ summary: 'Crear commit de calificación' })
@ApiParam({
  name: 'cedula',
  type: String,
  description: 'Cédula del empleado a calificar',
  example: '0921611760',  
  required: true
})
@ApiBody({
  description: 'Datos de calificación',
  type: CreateCommitKpiDto,
  examples: {
    ejemplo1: {
      value: {
        calificacionKPI: 150,
        observaciones: "Desempeño aceptable"
      }
    }
  }
})
@ApiResponse({
  status: 201,
  description: 'Commit creado exitosamente',
  type: CommitKpi
})
async createCommit(
  @Param('cedula') cedula: string,
  @Body() dto: CreateCommitKpiDto,
  @Req() req: Request
) {
  const user = req.user as User;
  return this.kpiService.createCommit(cedula, dto, user);
}

  @Get('commits/pending')
  @ApiOperation({ summary: 'Obtener commits pendientes' })
  async getPendingCommits() {
    return this.kpiService.getPendingCommits();
  }

  @Put('commits/:id/first-approval')
@ApiOperation({ summary: 'Primera aprobación de commit' })
async firstApproveCommit(
  @Param('id') id: string,
  @Headers() headers: Record<string, string>
) {
  const rawUser = await this.authService.getUsuarioActual(headers);
  const user: User = { name: rawUser.nombre } as User;
  return this.kpiService.firstApproveCommit(id, user);
}


  @Put('commits/:id/second-approval')
@Roles('admin')
@ApiOperation({ summary: 'Aprobar commit definitivamente' })
@ApiBody({
  type: ApproveCommitKpiDto,
  examples: {
    aprobar: { value: { action: 'approve' }},
    rechazar: { 
      value: { 
        action: 'reject',
        rejectionReason: "La calificación no cumple con los estándares"
      }
    }
  }
})
@ApiResponse({ 
  status: 200,
  description: 'Commit aprobado y calificación registrada en KPI',
  type: KPI
})
async secondApproveCommit(
  @Param('id') id: string,
  @Body() dto: ApproveCommitKpiDto,
  @Headers() headers: Record<string, string>
) {
  const rawUser = await this.authService.getUsuarioActual(headers);
  const user: User = { name: rawUser.nombre } as User;
  return this.kpiService.secondApproveCommit(id, dto, user);
}

@Put('commits/:id')
@ApiOperation({ 
  summary: 'Editar commit pendiente', 
  description: 'Actualiza la calificación y/o observaciones de un commit en estado pendiente (pending_first o pending_second)' 
})
@ApiParam({
  name: 'id',
  type: String,
  description: 'ID del commit (UUID)',
  example: '4d717484-ae18-4d39-bde6-4b9804922d9c'
})
@ApiBody({
  type: CreateCommitKpiDto,
  examples: {
    ejemplo1: {
      summary: 'Actualizar solo calificación',
      value: {
        calificacionKPI: 185
      }
    },
    ejemplo2: {
      summary: 'Actualizar ambos campos',
      value: {
        calificacionKPI: 210,
        observaciones: "Ajuste según retroalimentación del supervisor"
      }
    }
  }
})
@ApiResponse({ 
  status: 200, 
  description: 'Commit actualizado exitosamente',
  type: CommitKpi 
})
@ApiResponse({ 
  status: 400, 
  description: 'Error de validación: calificación fuera de rango (0-300) o commit no editable' 
})
@ApiResponse({ 
  status: 404, 
  description: 'Commit no encontrado' 
})
async updateCommit(
  @Param('id') id: string,
  @Body() dto: CreateCommitKpiDto
) {
  return this.kpiService.updateCommit(id, dto);
}
}