import { Injectable, Module, Inject, forwardRef, UnauthorizedException, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, In } from 'typeorm';
import { KPI } from './entities/kpi.entity';
import { Headcount } from '../headcount/entities/headcount.entity';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { Request } from 'express';
import { AprobarKpiDto } from './dto/aprobar-kpi.dto';
import { CommitKpi } from './entities/commit-kpi.entity';
import { CreateCommitKpiDto } from './dto/create-commit-kpi.dto';
import { ApproveCommitKpiDto } from './dto/approve-commit-kpi.dto';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KpiController } from './kpi.controller';



@Injectable()
export class KpiService {
  constructor(
    @InjectRepository(KPI)
    private kpiRepository: Repository<KPI>,
    @InjectRepository(Headcount)
    private headcountRepository: Repository<Headcount>,
    @InjectRepository(CommitKpi)
    private commitKpiRepository: Repository<CommitKpi>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private jwtService: JwtService
  ) {}


  procesarAprobacion(id: number, dto: AprobarKpiDto): any {
    return { message: `KPI with ID ${id} processed successfully`, data: dto };
  }
  
  private async generateTokenForUser(user: User): Promise<string> {
    // Si usas JWT
    const payload = { 
      sub: user.id, 
      name: user.name,
      role: user.role 
    };
    return this.jwtService.sign(payload); // Asegúrate de inyectar JwtService
    
    // O si prefieres simular el header:
    // return 'simulated-token-' + user.id;
  }

  async syncFromHeadcount(): Promise<{ updated: number }> {
    const headcounts = await this.headcountRepository.find({ 
      where: { kpi: MoreThan(0) }
    });
  
    let updated = 0;
    for (const hc of headcounts) {
      await this.kpiRepository.upsert(
        {
          cedula: hc.cedula,
          nombre: hc.nombre,
          cargoActividad: hc.cargoActividad,
          sueldo: hc.sueldo,
          kpi: hc.kpi,
          grupoCentrosCostos: hc.grupoCentrosCostos || 'Sin grupo', 
          calificacionKPI: 0,
          totalKPI: 0,
          observaciones: '',
          estado: 'pendiente',
          usuarioCalificador: 'sistema',
          fechaCalificacion: new Date()
        },
        ['cedula']
      );
      updated++;
    }
    return { updated };
  }
  
  async calificar(
    cedula: string,
    calificacionKPI: number,
    observaciones: string,
    headers: Record<string, string>
  ): Promise<KPI> {
   
    if (isNaN(calificacionKPI)) {
      throw new BadRequestException('calificacionKPI debe ser un número');
    }

    if (calificacionKPI < 0 || calificacionKPI > 300) {
      throw new BadRequestException('La calificación debe estar entre 0 y 300');
    }

    
    const usuario = await this.authService.getUsuarioActual(headers);

    
    const kpi = await this.kpiRepository.findOne({ where: { cedula } });
    if (!kpi) {
      throw new NotFoundException(`No se encontró KPI para la cédula ${cedula}`);
    }

    
    kpi.calificacionKPI = calificacionKPI;
    kpi.totalKPI = (kpi.kpi * calificacionKPI) / 100;
    kpi.observaciones = observaciones;
    kpi.usuarioCalificador = usuario.nombre;
    kpi.fechaCalificacion = new Date();

    return this.kpiRepository.save(kpi);
  }

  async createCommit(cedula: string, dto: CreateCommitKpiDto, user: User): Promise<CommitKpi> {
    // Obtener datos del empleado desde KPI
    const empleado = await this.kpiRepository.findOne({ 
      where: { cedula },
      select: ['nombre', 'cargoActividad', 'kpi'] // Solo los campos necesarios
    });
  
    if (!empleado) {
      throw new NotFoundException(`No se encontró empleado con cédula ${cedula}`);
    }
  
    const commit = this.commitKpiRepository.create({
      cedula,
      nombreEmpleado: empleado.nombre,
      cargoEmpleado: empleado.cargoActividad,
      calificacionKPI: dto.calificacionKPI,
      totalKPI: (empleado.kpi * dto.calificacionKPI) / 100,
      observaciones: dto.observaciones || '',
      status: 'pending_first',
      firstApprovalBy: user.name,
      createdAt: new Date()
    });
  
    return await this.commitKpiRepository.save(commit);
  }

  async firstApproveCommit(id: string, user: User): Promise<CommitKpi> {
    const commit = await this.commitKpiRepository.findOne({ where: { id } });
    
    if (!commit) {
      throw new NotFoundException('Commit no encontrado');
    }

    if (commit.status !== 'pending_first') {
      throw new BadRequestException('El commit no está en estado pendiente de primera aprobación');
    }

    commit.status = 'pending_second';
    commit.firstApprovalBy = user.name;
    commit.firstApprovalAt = new Date();

    return this.commitKpiRepository.save(commit);
  }

  async secondApproveCommit(id: string, dto: ApproveCommitKpiDto, user: User): Promise<KPI> {
    const commit = await this.commitKpiRepository.findOne({ where: { id } });
    
    if (!commit) throw new NotFoundException('Commit no encontrado');
    if (commit.status !== 'pending_second') {
      throw new BadRequestException('El commit debe estar en pending_second');
    }
  
    if (dto.action === 'reject') {
      if (!dto.rejectionReason) {
        throw new BadRequestException('Debe proporcionar una razón de rechazo');
      }
      commit.status = 'rejected';
      commit.rejectionReason = dto.rejectionReason as string;
      commit.secondApprovalBy = user.name;
      commit.secondApprovalAt = new Date();
      await this.commitKpiRepository.save(commit);
      throw new BadRequestException('Commit rechazado');
    }
  
    // Actualizar KPI directamente sin llamar a calificar()
    const kpi = await this.kpiRepository.findOne({ where: { cedula: commit.cedula } });
    if (!kpi) throw new NotFoundException('Empleado no encontrado en KPI');
  
    kpi.calificacionKPI = commit.calificacionKPI;
    kpi.totalKPI = (kpi.kpi * commit.calificacionKPI) / 100;
    kpi.observaciones = commit.observaciones || '';
    kpi.usuarioCalificador = commit.firstApprovalBy || user.name; // Usa el primer aprobador o el actual
    kpi.fechaCalificacion = new Date();
    kpi.estado = 'aprobado';
  
    // Actualizar estado del commit
    commit.status = 'approved';
    commit.secondApprovalBy = user.name;
    commit.secondApprovalAt = new Date();
    
    await this.commitKpiRepository.save(commit);
    return this.kpiRepository.save(kpi);
  }

  async getPendingCommits(): Promise<CommitKpi[]> {
    return this.commitKpiRepository.find({ 
      where: { 
        status: In(['pending_first', 'pending_second']) 
      } 
    });
  }

  async updateCommit(id: string, dto: CreateCommitKpiDto): Promise<CommitKpi> {
    const commit = await this.commitKpiRepository.findOne({ where: { id } });
    
    if (!commit) {
      throw new NotFoundException('Commit no encontrado');
    }

    if (!['pending_first', 'pending_second'].includes(commit.status)) {
      throw new BadRequestException('Solo se pueden editar commits pendientes');
    }

    const totalKPI = (dto.calificacionKPI * 100) / 100;

    commit.calificacionKPI = dto.calificacionKPI;
    commit.totalKPI = totalKPI;
    commit.observaciones = dto.observaciones || '';

    return this.commitKpiRepository.save(commit);
  }

}

@Module({
  imports: [
    TypeOrmModule.forFeature([KPI, Headcount, CommitKpi]),
    AuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [KpiController],
  providers: [KpiService],
})
export class KpiModule {}
