import { Controller, Get, Post, Body, UseGuards, Put, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePermissionsDto } from './dto/update-permissions.dto';
import { DeleteUserDto } from '@auth/dto/delete-user.dto'; 
import { ApiBearerAuth, ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('admin')
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  findAll() {
    return this.usersService.findAll();
  }

  @Put(':id/permissions')
  @Roles('admin')
  @ApiBody({ type: UpdatePermissionsDto })
  @ApiResponse({ status: 200, description: 'Permisos actualizados' })
  updatePermissions(
    @Param('id') id: string,
    @Body() updatePermissionsDto: UpdatePermissionsDto,
  ) {
    return this.usersService.updatePermissions(id, updatePermissionsDto.permissions);
  }

  
  @Delete('delete')
  @Roles('admin')
  @ApiBody({ type: DeleteUserDto })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  deleteByEmail(@Body() deleteUserDto: DeleteUserDto) {
    return this.usersService.deleteByEmail(deleteUserDto.email);
  }
}