import { IsNumber, IsString, Min, Max } from 'class-validator';

export class CalificarKpiDto {
  @IsNumber()
  @Min(0)
  @Max(300)
  calificacionKPI: number;

  @IsString()
  observaciones: string; 
}