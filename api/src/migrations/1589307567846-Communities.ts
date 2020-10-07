import { MigrationInterface, QueryRunner } from 'typeorm';

export class Communities1589307567846 implements MigrationInterface {
    name = 'Communities1589307567846';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "communities" DROP COLUMN "stars"',
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "communities" ADD "stars" integer',
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "communities" DROP COLUMN "issues"',
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "communities" ADD "issues" integer',
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "communities" DROP COLUMN "issues"',
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "communities" ADD "issues" character varying',
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "communities" DROP COLUMN "stars"',
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "communities" ADD "stars" character varying',
            undefined,
        );
    }
}
