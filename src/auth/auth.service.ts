import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async getUsuarioActual(headers: Record<string, string>): Promise<{ nombre: string }> {
    const authHeader = headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Formato de token inválido');
    }

    try {
      const payload = this.jwtService.verify(token);
      if (!payload.name) {
        throw new UnauthorizedException('Token no contiene información de usuario');
      }
      return { nombre: payload.name };
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(user: Omit<User, 'password'>) {
    if (!user?.id || !user?.email || !user?.name) {
      throw new UnauthorizedException('Datos de usuario incompletos');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name, // Asegurar que el nombre está incluido
      role: user.role,
      permissions: user.permissions || []
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }
}