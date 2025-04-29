import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('commit_kpi')
export class CommitKpi {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cedula: string;

  @Column()
  nombreEmpleado: string; // Nuevo campo

  @Column()
  cargoEmpleado: string; // Nuevo campo

  @Column('decimal', { precision: 5, scale: 2 })
  calificacionKPI: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalKPI: number;

  @Column({ type: 'text' })
  observaciones: string;

  @Column({ 
    default: 'pending_first'
  })
  status: 'pending_first' | 'pending_second' | 'approved' | 'rejected';

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  firstApprovalAt: Date;

  @Column({ nullable: true })
  firstApprovalBy: string;

  @Column({ type: 'timestamp', nullable: true })
  secondApprovalAt: Date;

  @Column({ nullable: true })
  secondApprovalBy: string;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;
}