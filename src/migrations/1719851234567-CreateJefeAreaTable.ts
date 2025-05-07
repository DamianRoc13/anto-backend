import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateJefeAreaTable1719851234567 implements MigrationInterface {
    name = 'CreateJefeAreaTable1719851234567';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear la tabla jefe_area solo si no existe
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "jefe_area" (
                "id" SERIAL PRIMARY KEY,
                "nombre" character varying NOT NULL,
                "contraseña" character varying NOT NULL,
                "departamento" character varying NOT NULL
            )
        `);

        // Agregar la columna jefeAreaId a la tabla kpi
        await queryRunner.query(`
            ALTER TABLE "kpi" 
            ADD COLUMN IF NOT EXISTS "jefeAreaId" integer
        `);

        // Agregar la clave foránea sin IF NOT EXISTS
        await queryRunner.query(`
            ALTER TABLE "kpi" 
            ADD CONSTRAINT "FK_kpi_jefe_area" FOREIGN KEY ("jefeAreaId") REFERENCES "jefe_area"("id") ON DELETE SET NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar la relación y la columna jefeAreaId
        await queryRunner.query(`
            ALTER TABLE "kpi" 
            DROP CONSTRAINT IF EXISTS "FK_kpi_jefe_area",
            DROP COLUMN IF EXISTS "jefeAreaId"
        `);

        // Eliminar la tabla jefe_area
        await queryRunner.query(`DROP TABLE IF EXISTS "jefe_area"`);
    }
}
