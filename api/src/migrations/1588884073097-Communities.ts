import { MigrationInterface, QueryRunner } from 'typeorm';

export class Communities1588884073097 implements MigrationInterface {
    name = 'Communities1588884073097';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "communities"
        (
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "id" SERIAL NOT NULL,
            "updated_at" TIMESTAMP DEFAULT now(),
            "github_repository" character varying NOT NULL,
            CONSTRAINT "UQ_5f38334a06b29816562865462dd" UNIQUE ("github_repository"),
            CONSTRAINT "PK_fea1fe83c86ccde9d0a089e7ea2" PRIMARY KEY ("id"))`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "communities"', undefined);
    }
}
