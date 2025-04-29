import { IsEnum, IsString, IsOptional } from 'class-validator';

export class ApproveCommitKpiDto {
  @IsEnum(['approve', 'reject'])
  action: 'approve' | 'reject';

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}