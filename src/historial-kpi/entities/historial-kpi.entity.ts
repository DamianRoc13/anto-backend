import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('historial_kpi')
export class HistorialKpi {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ type: 'timestamp' })
  fechaDe: Date;

  @Column({ type: 'timestamp' })
  fechaHasta: Date;

  @Column()
  guardadoPor: string;

  @Column({ type: 'jsonb' }) 
  tablaKpi: any;
}
