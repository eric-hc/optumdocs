import { MigrationInterface, QueryRunner } from 'typeorm';

export class Communities1589307438866 implements MigrationInterface {
    name = 'Communities1589307438866';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "communities" ADD "organization" character varying',
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "communities" ADD "repository" character varying',
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "communities" ADD "description" character varying',
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "communities" ADD "stars" character varying',
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "communities" ADD "issues" character varying',
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "communities" DROP COLUMN "issues"',
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "communities" DROP COLUMN "stars"',
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "communities" DROP COLUMN "description"',
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "communities" DROP COLUMN "repository"',
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "communities" DROP COLUMN "organization"',
            undefined,
        );
    }
}
