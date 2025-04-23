// src/headcount/dto/create-headcount.dto.ts
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateHeadcountDto {
  @IsOptional()
  @IsString()
  tipoIESS?: string;

  @IsOptional()
  @IsString()
  mes1?: string;

  @IsOptional()
  @IsString()
  mes2?: string;

  @IsOptional()
  @IsString()
  fechaEntradaSalida?: string;

  @IsOptional()
  @IsString()
  anio?: string;

  @IsOptional()
  @IsString()
  cedula?: string;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsNumber()
  sueldo?: number;

  @IsOptional()
  @IsNumber()
  kpi?: number;

  @IsOptional()
  @IsString()
  tipoContrato?: string;

  @IsOptional()
  @IsString()
  movilizacionExtrasNoGrab?: string;

  @IsOptional()
  @IsString()
  reingreso?: string;

  @IsOptional()
  @IsString()
  diasArranque?: string;

  @IsOptional()
  @IsString()
  detalle?: string;

  @IsOptional()
  @IsString()
  cargoActividad?: string;

  @IsOptional()
  @IsString()
  grupoCentrosCostos?: string;

  @IsOptional()
  @IsString()
  centroCostosN1?: string;

  @IsOptional()
  @IsString()
  centroCostosN2?: string;

  @IsOptional()
  @IsString()
  registroAvisoEntradaSalidaIESS?: string;

  @IsOptional()
  @IsString()
  fechaLegalizacionContrato?: string;

  @IsOptional()
  @IsString()
  fechaTope?: string;

  @IsOptional()
  @IsString()
  autorizacion1?: string;

  @IsOptional()
  @IsString()
  autorizacion2?: string;
}