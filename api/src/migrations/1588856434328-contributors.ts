import { MigrationInterface, QueryRunner } from 'typeorm';

export class Contributors1588856434328 implements MigrationInterface {
    name = 'contributors1588856434328';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            CREATE TABLE "contributors"
            (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "github_username" character varying NOT NULL,
                CONSTRAINT "UQ_dab60130357ecf9e19a03c2c34d" UNIQUE ("github_username"),
                CONSTRAINT "PK_c94ff4e6bca235dc30625c92c90" PRIMARY KEY ("id"))`,
            undefined,
        );
        await queryRunner.query(
            'ALTER TYPE "public"."users_role_enum" RENAME TO "users_role_enum_old"',
            undefined,
        );
        await queryRunner.query(
            "CREATE TYPE \"users_role_enum\" AS ENUM('USER', 'ADMIN')",
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT',
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "role" TYPE "users_role_enum" USING "role"::"text"::"users_role_enum"',
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT \'USER\'',
            undefined,
        );
        await queryRunner.query('DROP TYPE "users_role_enum_old"', undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TYPE "users_role_enum_old" AS ENUM(\'USER\')',
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT',
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "role" TYPE "users_role_enum_old" USING "role"::"text"::"users_role_enum_old"',
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT \'USER\'',
            undefined,
        );
        await queryRunner.query('DROP TYPE "users_role_enum"', undefined);
        await queryRunner.query(
            'ALTER TYPE "users_role_enum_old" RENAME TO  "users_role_enum"',
            undefined,
        );
        await queryRunner.query('DROP TABLE "contributors"', undefined);
    }
}
