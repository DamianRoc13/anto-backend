// src/headcount/dto/commit.dto.ts
import { IsArray, IsString, IsNotEmpty } from 'class-validator';
import { Headcount } from '../entities/headcount.entity';

export class CreateCommitDto {
  @IsArray()
  @IsNotEmpty()
  oldData: Headcount[];

  @IsArray()
  @IsNotEmpty()
  newData: Headcount[];

  @IsString()
  @IsNotEmpty()
  message: string;
}