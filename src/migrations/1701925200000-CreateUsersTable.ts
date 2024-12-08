import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1701925200000 implements MigrationInterface {
    name = 'CreateUsersTable1701925200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" BIGINT PRIMARY KEY DEFAULT unique_rowid(),
                "userId" UUID UNIQUE DEFAULT gen_random_uuid(),
                "name" VARCHAR NOT NULL,
                "email" VARCHAR NOT NULL UNIQUE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
