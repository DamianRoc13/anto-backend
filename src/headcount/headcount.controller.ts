import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    UseGuards,
  } from '@nestjs/common';
  import { HeadcountService } from './headcount.service';
  import { CreateHeadcountDto } from './dto/create-headcount.dto';
  import { UpdateHeadcountDto } from './dto/update-headcount.dto';
  import { CreateCommitDto } from './dto/commit.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { RolesGuard } from '../auth/roles.guard';
  import { Roles } from '../auth/roles.decorator';
  import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
  
  @ApiTags('Headcount Management')
  @ApiBearerAuth()
  @Controller('headcount')
  @UseGuards(JwtAuthGuard) // Autenticación básica para todos los endpoints
  export class HeadcountController {
    constructor(private readonly headcountService: HeadcountService) {}
  
    // Endpoints CRUD disponibles para todos los usuarios autenticados
    @Post()
    @ApiOperation({ summary: 'Crear nuevo registro de headcount' })
    @ApiResponse({ status: 201, description: 'Registro creado exitosamente' })
    create(@Body() createHeadcountDto: CreateHeadcountDto) {
      return this.headcountService.create(createHeadcountDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Obtener todos los registros de headcount' })
    @ApiResponse({ status: 200, description: 'Lista de registros' })
    findAll() {
      return this.headcountService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Obtener un registro por ID' })
    @ApiResponse({ status: 200, description: 'Registro encontrado' })
    findOne(@Param('id') id: string) {
      return this.headcountService.findOne(+id);
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Actualizar un registro' })
    @ApiResponse({ status: 200, description: 'Registro actualizado' })
    update(
      @Param('id') id: string,
      @Body() updateHeadcountDto: UpdateHeadcountDto,
    ) {
      return this.headcountService.update(+id, updateHeadcountDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un registro' })
    @ApiResponse({ status: 200, description: 'Registro eliminado' })
    remove(@Param('id') id: string) {
      return this.headcountService.remove(+id);
    }
  
    @Post('commits')
    @ApiOperation({ summary: 'Crear un commit para aprobación' })
    @ApiResponse({ status: 201, description: 'Commit creado exitosamente' })
    createCommit(@Body() createCommitDto: CreateCommitDto) {
      return this.headcountService.createCommit(createCommitDto);
    }
  
    @Get('commits/pending')
    @ApiOperation({ summary: 'Obtener commits pendientes de aprobación' })
    @ApiResponse({ status: 200, description: 'Lista de commits pendientes' })
    getPendingCommits() {
      return this.headcountService.getPendingCommits();
    }
  
    // Endpoints de aprobación solo para admin (usando string literal)
    @Post('commits/:id/approve')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin') // Usamos el string literal 'admin'
    @ApiOperation({ summary: 'Aprobar un commit (solo admin)' })
    @ApiResponse({ status: 403, description: 'No tiene permisos' })
    approveCommit(
      @Param('id') id: string,
      @Body('approvedBy') approvedBy: string,
    ) {
      return this.headcountService.approveCommit(id, approvedBy);
    }
  
    @Post('commits/:id/reject')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin') // Usamos el string literal 'admin'
    @ApiOperation({ summary: 'Rechazar un commit (solo admin)' })
    @ApiResponse({ status: 403, description: 'No tiene permisos' })
    rejectCommit(
      @Param('id') id: string,
      @Body('rejectedBy') rejectedBy: string,
    ) {
      return this.headcountService.rejectCommit(id, rejectedBy);
    }
  }