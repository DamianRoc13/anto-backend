import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateKpiDto {
  @IsNotEmpty()
  @IsString()
  cedula: string;

  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  cargoActividad: string;

  @IsNotEmpty()
  @IsNumber()
  sueldo: number;

  @IsNotEmpty()
  @IsNumber()
  kpi: number;

  @IsNotEmpty()
  @IsString()
  grupoCentrosCostos: string;

  @IsOptional()
  @IsNumber()
  calificacionKPI?: number;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsNotEmpty()
  @IsString()
  usuarioCalificador: string;
}