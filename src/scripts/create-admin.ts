import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRole } from '../users/dto/create-user.dto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    const adminDto: CreateUserDto = {
      email: 'damianolivo2018@gmail.com',
      name: 'admin',
      password: 'Admin123@', 
      role: UserRole.ADMIN,
      permissions: ['all']
    };

    const existingAdmin = await usersService.findOne(adminDto.email);
    if (existingAdmin) {
      console.log('El usuario admin ya existe');
      console.log(`Email: ${adminDto.email}`);
      return;
    }

    
    const createdAdmin = await usersService.create(adminDto);

    console.log('Usuario admin creado exitosamente');
    console.log(`Email: ${createdAdmin.email}`);
    console.log(`Password: ${adminDto.password}`); 
    console.log('Cambia esta contraseña inmediatamente después del primer login');
  } catch (error) {
    console.error('Error creando usuario admin:', error);
    if (error.response?.message) {
      console.error('Detalles:', error.response.message);
    }
  } finally {
    await app.close();
    process.exit(0); 
  }
}

bootstrap();