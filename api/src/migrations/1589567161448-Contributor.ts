import { MigrationInterface, QueryRunner } from 'typeorm';

export class Contributor1589567161448 implements MigrationInterface {
    name = 'Contributor1589567161448';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "contributors" ADD "avatar_url" character varying',
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "contributors" DROP COLUMN "avatar_url"',
            undefined,
        );
    }
}
