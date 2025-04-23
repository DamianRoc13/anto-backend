// src/headcount/dto/update-headcount.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateHeadcountDto } from './create-headcount.dto';

export class UpdateHeadcountDto extends PartialType(CreateHeadcountDto) {}