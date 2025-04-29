import { IsNumber, IsString, Min, Max, IsOptional } from 'class-validator';

export class CreateCommitKpiDto {
  @IsNumber()
  @Min(0)
  @Max(300)
  calificacionKPI: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}