import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJefeAreaDto {
  @ApiProperty({
    description: 'Cédula del jefe de área (10 dígitos)',
    example: '0123456789',
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 10, { message: 'El id debe ser una cédula válida de 10 dígitos.' })
  id: string;

  @ApiProperty({
    description: 'Nombre completo del jefe de área',
    example: 'Juan Pérez',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    description: 'Contraseña del jefe de área',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  contraseña: string;

  @ApiPropertyOptional({
    description: 'Departamento al que pertenece el jefe de área',
    example: 'Recursos Humanos',
  })
  @IsString()
  @IsOptional()
  departamento?: string;
}
