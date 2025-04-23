import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({ example: '531302fa-7298-4111-bd5f-6c8885ad567f', description: 'Id del usuario a eliminar' })
  @IsNotEmpty()
  id: string;
}