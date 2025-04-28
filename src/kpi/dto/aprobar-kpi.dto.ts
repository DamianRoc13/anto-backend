import { IsEnum, IsString, IsNumber, Min, Max } from 'class-validator';

export enum AccionAprobacion {
  APROBAR = 'aprobar',
  RECHAZAR = 'rechazar',
  MODIFICAR = 'modificar'
}

export class AprobarKpiDto {
  @IsEnum(AccionAprobacion)
  accion: 'aprobar' | 'rechazar' | 'modificar';

  @IsString()
  observaciones: string; 

  @IsNumber()
  @Min(0)
  @Max(300)
  calificacionKPI: number;
}