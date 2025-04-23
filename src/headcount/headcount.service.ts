// src/headcount/headcount.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const commit = this.commitRepository.create({
      oldData: JSON.stringify(createCommitDto.oldData),
      newData: JSON.stringify(createCommitDto.newData),
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

    // Parse and apply changes
    const newData: Headcount[] = JSON.parse(commit.newData);
    
    // Clear existing data and save new data
    await this.headcountRepository.clear();
    const savedData = await this.headcountRepository.save(newData);

    // Update commit status
    commit.status = 'approved';
    commit.approvedAt = new Date();
    commit.approvedBy = approvedBy;
    await this.commitRepository.save(commit);

    return savedData;
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