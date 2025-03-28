import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({ example: 'usuario@ejemplo.com', description: 'Email del usuario a eliminar' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}