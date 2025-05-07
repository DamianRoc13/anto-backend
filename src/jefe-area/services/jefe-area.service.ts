import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JefeArea } from '../entities/jefe-area.entity';
import { CreateJefeAreaDto } from '../dto/create-jefe-area.dto';

@Injectable()
export class JefeAreaService {
  constructor(
    @InjectRepository(JefeArea)
    private readonly jefeAreaRepository: Repository<JefeArea>,
  ) {}

  async create(createJefeAreaDto: CreateJefeAreaDto): Promise<JefeArea> {
    const jefeArea = this.jefeAreaRepository.create(createJefeAreaDto);
    return this.jefeAreaRepository.save(jefeArea);
  }

  async findAll(): Promise<JefeArea[]> {
    return this.jefeAreaRepository.find();
  }
}
