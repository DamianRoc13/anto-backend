import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdatePermissionsDto {
  @ApiProperty({
    type: [String],
    example: ['dashboard:view', 'users:edit'],
    description: 'Lista de permisos a asignar al usuario',
    required: true
  })
  @IsArray()
  @IsNotEmpty()
  permissions: string[];
}