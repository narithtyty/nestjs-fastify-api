import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordToUsers1701925300000 implements MigrationInterface {
    name = 'AddPasswordToUsers1701925300000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD COLUMN "password" VARCHAR NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            DROP COLUMN "password"
        `);
    }
}
