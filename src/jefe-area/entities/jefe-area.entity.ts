import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { KPI } from '../../kpi/entities/kpi.entity';

@Entity()
export class JefeArea {
  @PrimaryColumn()
  id: string; 

  @Column()
  nombre: string;

  @Column()
  contraseña: string;

  @Column({ nullable: true })
  departamento: string;

  @OneToMany(() => KPI, (kpi) => kpi.jefeArea)
  kpis: KPI[];
}
