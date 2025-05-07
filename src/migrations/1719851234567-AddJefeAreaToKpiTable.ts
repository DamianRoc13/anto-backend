import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJefeAreaToKpiTable1719851234567 implements MigrationInterface {
    name = 'AddJefeAreaToKpiTable1719851234567';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Agregar la columna jefeArea con valor por defecto
        await queryRunner.query(`
            ALTER TABLE "kpi" 
            ADD COLUMN "jefeArea" character varying DEFAULT ''
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar la columna jefeArea
        await queryRunner.query(`
            ALTER TABLE "kpi" 
            DROP COLUMN "jefeArea"
        `);
    }
}
