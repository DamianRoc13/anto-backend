import { MigrationInterface, QueryRunner } from "typeorm";

export class RecreateCommitKpiTable1719851234567 implements MigrationInterface {
    name = 'RecreateCommitKpiTable1719851234567';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Eliminar la tabla existente (si existe)
        await queryRunner.query(`DROP TABLE IF EXISTS "commit_kpi" CASCADE`);

        // 2. Crear nueva tabla con la estructura actualizada
        await queryRunner.query(`
            CREATE TABLE "commit_kpi" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "cedula" character varying NOT NULL,
                "nombre_empleado" character varying NOT NULL,
                "cargo_empleado" character varying NOT NULL,
                "calificacion_kpi" numeric(5,2) NOT NULL,
                "total_kpi" numeric(10,2) NOT NULL,
                "observaciones" text NOT NULL,
                "status" character varying NOT NULL DEFAULT 'pending_first',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "first_approval_at" TIMESTAMP,
                "first_approval_by" character varying,
                "second_approval_at" TIMESTAMP,
                "second_approval_by" character varying,
                "rejection_reason" text
            )
        `);

        // 3. Crear índices para mejorar el rendimiento
        await queryRunner.query(`CREATE INDEX "IDX_commit_kpi_cedula" ON "commit_kpi" ("cedula") `);
        await queryRunner.query(`CREATE INDEX "IDX_commit_kpi_status" ON "commit_kpi" ("status") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Esto revertirá la migración eliminando la tabla
        await queryRunner.query(`DROP TABLE "commit_kpi"`);
    }
}