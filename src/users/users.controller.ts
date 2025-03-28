import { Controller, Get, Post, Body, UseGuards, Put, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto'; 
import { UpdatePermissionsDto } from './dto/update-permissions.dto'; 
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Put(':id/permissions')
  @Roles('admin')
  updatePermissions(
    @Param('id') id: string,
    @Body() updatePermissionsDto: UpdatePermissionsDto,
  ) {
    return this.usersService.updatePermissions(+id, updatePermissionsDto.permissions);
  }
}