import { ApiProperty } from '@nestjs/swagger';

export class ResponseHistorialKpiDto {
  @ApiProperty({
    description: 'ID del historial de KPI',
    example: 'uuid-generado',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del historial',
    example: 'Historial de KPI - Enero 2025',
  })
  nombre: string;

  @ApiProperty({
    description: 'Fecha de inicio del historial (formato YYYY-MM-DD)',
    example: '2025-01-01',
  })
  fechaDe: string;

  @ApiProperty({
    description: 'Fecha de fin del historial (formato YYYY-MM-DD)',
    example: '2025-01-31',
  })
  fechaHasta: string;

  @ApiProperty({
    description: 'Nombre de la persona que guarda el historial',
    example: 'Juan Pérez',
  })
  guardadoPor: string;

  @ApiProperty({
    description: 'Datos de la tabla KPI',
    example: [],
  })
  tablaKpi: any[];
}
