import { IsNotEmpty, IsString, IsDate, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateHistorialKpiDto {
  @ApiProperty({
    description: 'Nombre del historial',
    example: 'Historial de KPI - Enero 2025',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    description: 'Fecha de inicio del historial',
    example: '2025-01-01T00:00:00.000Z',
  })
  @Type(() => Date) // Convierte automáticamente a Date
  @IsDate()
  @IsNotEmpty()
  fechaDe: Date;

  @ApiProperty({
    description: 'Fecha de fin del historial',
    example: '2025-01-31T23:59:59.000Z',
  })
  @Type(() => Date) 
  @IsDate()
  @IsNotEmpty()
  fechaHasta: Date;

  @ApiProperty({
    description: 'Nombre de la persona que guarda el historial',
    example: 'Juan Pérez',
  })
  @IsString()
  @IsNotEmpty()
  guardadoPor: string;

  @ApiProperty({
    description: 'Datos de la tabla KPI',
    example: [],
  })
  @IsArray()
  tablaKpi: any[];
}
