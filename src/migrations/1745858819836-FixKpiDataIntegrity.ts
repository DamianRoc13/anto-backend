// src/migrations/1745858819836-FixKpiDataIntegrity.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixKpiDataIntegrity1745858819836 implements MigrationInterface {
  name = 'FixKpiDataIntegrity1745858819836'; // El nombre debe coincidir con la clase

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Corregir NULL en grupoCentrosCostos
    await queryRunner.query(`
      UPDATE kpi 
      SET "grupoCentrosCostos" = COALESCE("grupoCentrosCostos", 'Sin grupo')
      WHERE "grupoCentrosCostos" IS NULL
    `);
    
    // 2. Verificar si la restricción ya existe antes de crearla
    const constraintExists = await queryRunner.query(`
      SELECT 1 FROM pg_constraint 
      WHERE conname = 'UQ_kpi_cedula' 
      AND conrelid = 'kpi'::regclass
    `);
    
    if (!constraintExists.length) {
      await queryRunner.query(`
        ALTER TABLE kpi 
        ADD CONSTRAINT UQ_kpi_cedula UNIQUE ("cedula")
      `);
    }
    
    // 3. Establecer NOT NULL en grupoCentrosCostos
    await queryRunner.query(`
      ALTER TABLE kpi 
      ALTER COLUMN "grupoCentrosCostos" SET NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Eliminar restricción NOT NULL
    await queryRunner.query(`
      ALTER TABLE kpi 
      ALTER COLUMN "grupoCentrosCostos" DROP NOT NULL
    `);
    
    // 2. Eliminar restricción UNIQUE si existe
    await queryRunner.query(`
      ALTER TABLE kpi 
      DROP CONSTRAINT IF EXISTS UQ_kpi_cedula
    `);
  }
}