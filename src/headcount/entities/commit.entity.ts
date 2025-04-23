// src/headcount/entities/commit.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Commit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  oldData: string;

  @Column({ type: 'text' })
  newData: string;

  @Column()
  message: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  approvedAt: Date;

  @Column({ nullable: true })
  approvedBy: string;
}