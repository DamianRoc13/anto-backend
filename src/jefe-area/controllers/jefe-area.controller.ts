import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
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
}
