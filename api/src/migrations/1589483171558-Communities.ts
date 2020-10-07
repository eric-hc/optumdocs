import { MigrationInterface, QueryRunner } from 'typeorm';

export class Communities1589483171558 implements MigrationInterface {
    name = 'Communities1589483171558';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "communities" ADD "watchers" integer',
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "communities" ADD "forks" integer',
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "communities" DROP COLUMN "forks"',
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "communities" DROP COLUMN "watchers"',
            undefined,
        );
    }
}
