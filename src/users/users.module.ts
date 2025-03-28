import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Esta línea es crucial
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // Exportar si otros módulos lo necesitan
})
export class UsersModule {}