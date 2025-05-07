import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique, ManyToOne } from 'typeorm';
import { JefeArea } from '../../jefe-area/entities/jefe-area.entity';

@Entity()
@Unique(['cedula']) // Añade esta línea para crear una restricción única en la columna cedula
export class KPI {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cedula: string; // Esta columna ahora tendrá una restricción UNIQUE

  @Column()
  nombre: string;

  @Column()
  cargoActividad: string;

  @Column('decimal', { precision: 10, scale: 2 })
  sueldo: number;

  @Column('decimal', { precision: 10, scale: 2 })
  kpi: number;

  @Column({ default: 'Sin grupo' }) 
  grupoCentrosCostos: string;

  @Column('decimal', { 
    precision: 5, 
    scale: 2, 
    default: 0 
  })
  calificacionKPI: number;

  @Column('decimal', { 
    precision: 10, 
    scale: 2, 
    default: 0 
  })
  totalKPI: number;

  @Column({ default: '' })
  observaciones: string;

  @Column({ default: 'pendiente' })
  estado: 'pendiente' | 'aprobado' | 'rechazado';

  @CreateDateColumn({
    type: 'timestamp with time zone',
    transformer: {
      from: (value: Date) => value.toLocaleString('en-US', { timeZone: 'America/Guayaquil' }),
      to: (value: Date) => value
    }
  })
  fechaCalificacion: Date;

  @Column({ default: '' })
  usuarioCalificador: string;

  @ManyToOne(() => JefeArea, (jefeArea) => jefeArea.kpis, { nullable: true })
  jefeArea: JefeArea | null;
}