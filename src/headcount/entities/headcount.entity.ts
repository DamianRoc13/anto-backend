// src/headcount/entities/headcount.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Headcount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  tipoIESS: string;

  @Column({ nullable: true })
  mes1: string;

  @Column({ nullable: true })
  mes2: string;

  @Column({ nullable: true })
  fechaEntradaSalida: string;

  @Column({ nullable: true })
  anio: string;

  @Column({ nullable: true })
  cedula: string;

  @Column({ nullable: true })
  nombre: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  sueldo: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  kpi: number;

  @Column({ nullable: true })
  tipoContrato: string;

  @Column({ nullable: true })
  movilizacionExtrasNoGrab: string;

  @Column({ nullable: true })
  reingreso: string;

  @Column({ nullable: true })
  diasArranque: string;

  @Column({ nullable: true })
  detalle: string;

  @Column({ nullable: true })
  cargoActividad: string;

  @Column({ nullable: true })
  grupoCentrosCostos: string;

  @Column({ nullable: true })
  centroCostosN1: string;

  @Column({ nullable: true })
  centroCostosN2: string;

  @Column({ nullable: true })
  registroAvisoEntradaSalidaIESS: string;

  @Column({ nullable: true })
  fechaLegalizacionContrato: string;

  @Column({ nullable: true })
  fechaTope: string;

  @Column({ nullable: true })
  autorizacion1: string;

  @Column({ nullable: true })
  autorizacion2: string;
}