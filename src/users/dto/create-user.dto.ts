import { ApiProperty } from '@nestjs/swagger';
import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  MinLength, 
  MaxLength,
  IsEnum 
} from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export class CreateUserDto {
  @ApiProperty({
    example: 'usuario@ejemplo.com',
    description: 'Email del usuario',
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del usuario',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'passwordSeguro123',
    description: 'Contraseña (mínimo 8 caracteres)',
    required: true,
    minLength: 8
  })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @ApiProperty({
    enum: UserRole,
    default: UserRole.USER,
    description: 'Rol del usuario',
    required: false
  })
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({
    type: [String],
    example: ['feature1', 'feature2'],
    description: 'Permisos específicos del usuario',
    required: false
  })
  permissions?: string[];
}