import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'>> {
    // 1. Buscar usuario
    const user = await this.usersService.findOne(email);
    if (!user) {
      console.log(`Usuario no encontrado: ${email}`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 2. Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(`Contraseña inválida para usuario: ${email}`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 3. Retornar usuario sin password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(user: Omit<User, 'password'>) {
    // 1. Verificar que el usuario tenga los datos requeridos
    if (!user?.id || !user?.email) {
      console.error('Datos de usuario incompletos para generar JWT', user);
      throw new UnauthorizedException('Datos de usuario incompletos');
    }

    // 2. Crear payload del token
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions || []
    };

    console.log('Generando token para:', payload);

    // 3. Firmar y retornar token
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    };
  }
}