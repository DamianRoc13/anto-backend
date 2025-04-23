import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Headcount } from './entities/headcount.entity';
import { Commit } from './entities/commit.entity';
import { CreateHeadcountDto } from './dto/create-headcount.dto';
import { UpdateHeadcountDto } from './dto/update-headcount.dto';
import { CreateCommitDto } from './dto/commit.dto';

@Injectable()
export class HeadcountService {
  constructor(
    @InjectRepository(Headcount)
    private headcountRepository: Repository<Headcount>,
    @InjectRepository(Commit)
    private commitRepository: Repository<Commit>,
  ) {}

  async create(createHeadcountDto: CreateHeadcountDto): Promise<Headcount> {
    const headcount = this.headcountRepository.create(createHeadcountDto);
    return this.headcountRepository.save(headcount);
  }

  async findAll(): Promise<Headcount[]> {
    return this.headcountRepository.find();
  }

  async findOne(id: number): Promise<Headcount> {
    const headcount = await this.headcountRepository.findOne({ where: { id } });
    if (!headcount) {
      throw new NotFoundException(`Headcount with ID ${id} not found`);
    }
    return headcount;
  }

  async update(
    id: number,
    updateHeadcountDto: UpdateHeadcountDto,
  ): Promise<Headcount> {
    const headcount = await this.findOne(id); 
    Object.assign(headcount, updateHeadcountDto);
    return this.headcountRepository.save(headcount);
  }

  async remove(id: number): Promise<void> {
    const result = await this.headcountRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Headcount with ID ${id} not found`);
    }
  }

  async createCommit(createCommitDto: CreateCommitDto): Promise<Commit> {
    // Validar datos antes de crear el commit
    if (!createCommitDto.newData || !Array.isArray(createCommitDto.newData)) {
      throw new Error('Invalid newData format');
    }

    const commit = this.commitRepository.create({
      oldData: JSON.stringify(createCommitDto.oldData),
      newData: JSON.stringify(createCommitDto.newData.map((item: { sueldo: string | number; kpi: string | number }) => ({
        ...item,
        sueldo: typeof item.sueldo === 'string' ? 
               parseFloat(item.sueldo.replace(',', '.')) : 
               item.sueldo,
        kpi: typeof item.kpi === 'string' ? 
             parseFloat(item.kpi.replace(',', '.')) : 
             item.kpi
      }))),
      message: createCommitDto.message,
      status: 'pending',
    });
    return this.commitRepository.save(commit);
  }

  async getPendingCommits(): Promise<Commit[]> {
    return this.commitRepository.find({ where: { status: 'pending' } });
  }

  async approveCommit(id: string, approvedBy: string): Promise<Headcount[]> {
    const commit = await this.commitRepository.findOne({ where: { id } });
    if (!commit) {
        throw new NotFoundException(`Commit with ID ${id} not found`);
    }

    let parsedData: any;
    try {
        parsedData = JSON.parse(commit.newData);
        if (!Array.isArray(parsedData)) {
            throw new Error('Invalid data format: expected array');
        }
    } catch (e) {
        throw new Error(`Failed to parse commit data: ${e.message}`);
    }

    return this.headcountRepository.manager.transaction(async (manager) => {
        // 1. Eliminar todos los registros existentes
        await manager.delete(Headcount, {});

        // 2. Preparar los nuevos datos con tipos explícitos
        const newData: Headcount[] = parsedData.map((item: any) => {
            const headcount = new Headcount();
            
            // Mapear todos los campos manualmente
            headcount.tipoIESS = item.tipoIESS || undefined;
            headcount.mes1 = item.mes1 || undefined;
            headcount.mes2 = item.mes2 || undefined;
            headcount.fechaEntradaSalida = item.fechaEntradaSalida || undefined;
            headcount.anio = item.anio || undefined;
            headcount.cedula = item.cedula || undefined;
            headcount.nombre = item.nombre || undefined;
            
            // Manejo especial para campos numéricos
            headcount.sueldo = item.sueldo !== undefined && item.sueldo !== null ? 
                Number(item.sueldo) : 
                0; // Valor por defecto numérico
            
            headcount.kpi = item.kpi !== undefined && item.kpi !== null ? 
                Number(item.kpi) : 
                0; // Valor por defecto numérico
            
            // Resto de campos
            headcount.tipoContrato = item.tipoContrato || undefined;
            headcount.movilizacionExtrasNoGrab = item.movilizacionExtrasNoGrab || undefined;
            headcount.reingreso = item.reingreso || undefined;
            headcount.diasArranque = item.diasArranque || undefined;
            headcount.detalle = item.detalle || undefined;
            headcount.cargoActividad = item.cargoActividad || undefined;
            headcount.grupoCentrosCostos = item.grupoCentrosCostos || undefined;
            headcount.centroCostosN1 = item.centroCostosN1 || undefined;
            headcount.centroCostosN2 = item.centroCostosN2 || undefined;
            headcount.registroAvisoEntradaSalidaIESS = item.registroAvisoEntradaSalidaIESS || undefined;
            headcount.fechaLegalizacionContrato = item.fechaLegalizacionContrato || undefined;
            headcount.fechaTope = item.fechaTope || undefined;
            headcount.autorizacion1 = item.autorizacion1 || undefined;
            headcount.autorizacion2 = item.autorizacion2 || undefined;
            
            return headcount;
        });

        // 3. Insertar los nuevos datos
        const savedData = await manager.save(Headcount, newData);

        // 4. Actualizar estado del commit
        commit.status = 'approved';
        commit.approvedAt = new Date();
        commit.approvedBy = approvedBy;
        await manager.save(Commit, commit);

        return savedData;
    });
}

  async rejectCommit(id: string, rejectedBy: string): Promise<Commit> {
    const commit = await this.commitRepository.findOne({ where: { id } });
    if (!commit) {
      throw new NotFoundException(`Commit with ID ${id} not found`);
    }

    commit.status = 'rejected';
    commit.approvedBy = rejectedBy;
    return this.commitRepository.save(commit);
  }
}