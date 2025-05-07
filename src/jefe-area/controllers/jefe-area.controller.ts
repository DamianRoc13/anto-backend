import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JefeAreaService } from '../services/jefe-area.service';
import { CreateJefeAreaDto } from '../dto/create-jefe-area.dto';
import { JefeArea } from '../entities/jefe-area.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('JefeArea') 
@ApiBearerAuth() 
@UseGuards(AuthGuard('jwt')) 
@Controller('jefe-area')
export class JefeAreaController {
  constructor(private readonly jefeAreaService: JefeAreaService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Jefe de área creado exitosamente.',
    type: JefeArea,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos.',
  })
  async create(@Body() createJefeAreaDto: CreateJefeAreaDto) {
    return this.jefeAreaService.create(createJefeAreaDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lista de todos los jefes de área.',
    type: [JefeArea],
  })
  async findAll() {
    return this.jefeAreaService.findAll();
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'Cédula del jefe de área a eliminar (10 dígitos)',
    example: '0123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Jefe de área eliminado exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Jefe de área no encontrado.',
  })
  async delete(@Param('id') id: string) {
    return this.jefeAreaService.delete(id);
  }
}
