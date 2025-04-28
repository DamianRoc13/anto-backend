import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CalificarKpiDto {
  @IsNumber()
  @Min(0)
  @Max(300)
  calificacionKPI: number;

  @IsOptional()
  observaciones?: string;
}