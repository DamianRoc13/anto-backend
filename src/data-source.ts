// src/data-source.ts
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { KPI } from './kpi/entities/kpi.entity';
import { Headcount } from './headcount/entities/headcount.entity';
import { JefeArea } from './jefe-area/entities/jefe-area.entity';

config(); // Carga las variables de entorno

// Extrae los componentes de la URL de la base de datos
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}
const dbUrl = new URL(process.env.DATABASE_URL);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port),
  username: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.split('/')[1],
  entities: [KPI, Headcount, JefeArea],
  migrations: ['src/migrations/*.ts'],
  synchronize: process.env.NODE_ENV === 'development', // Solo en desarrollo
  ssl: {
    rejectUnauthorized: false // Necesario para Railway
  }
});