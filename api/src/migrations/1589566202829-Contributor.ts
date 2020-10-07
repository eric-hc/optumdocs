import { MigrationInterface, QueryRunner } from 'typeorm';

export class Contributor1589566202829 implements MigrationInterface {
    name = 'Contributor1589566202829';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "contributors" ADD "name" character varying',
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "contributors" ADD "location" character varying',
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "contributors" DROP COLUMN "location"',
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "contributors" DROP COLUMN "name"',
            undefined,
        );
    }
}
