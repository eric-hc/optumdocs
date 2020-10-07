import { MigrationInterface, QueryRunner } from 'typeorm';

export class PullRequest1589827871604 implements MigrationInterface {
    name = 'PullRequest1589827871604';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "pullrequests"
                ("created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "id" SERIAL NOT NULL,
                "updated_at" TIMESTAMP DEFAULT now(),
                "number" integer,
                "title" character varying,
                "pr_state" character varying,
                "merged_at" TIMESTAMP,
                "contributor_id" integer,
                "community_repository_id" integer,
            CONSTRAINT "PK_a92da4eb7af1494282ee02fc2dd" PRIMARY KEY ("id"))`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "pullrequests"
                ADD CONSTRAINT "FK_ba72d1e3dfeef19d6deb2acbdf8"
                    FOREIGN KEY ("contributor_id")
                    REFERENCES "contributors"("id")
                ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined,
        );
        await queryRunner.query(
            `ALTER TABLE "pullrequests"
                ADD CONSTRAINT "FK_2aa99cbe5afa42a8cdf3a7f2dc9"
                    FOREIGN KEY ("community_repository_id")
                    REFERENCES "communities"("id")
                ON DELETE CASCADE ON UPDATE NO ACTION`,
            undefined,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "pullrequests" DROP CONSTRAINT "FK_2aa99cbe5afa42a8cdf3a7f2dc9"',
            undefined,
        );
        await queryRunner.query(
            'ALTER TABLE "pullrequests" DROP CONSTRAINT "FK_ba72d1e3dfeef19d6deb2acbdf8"',
            undefined,
        );
        await queryRunner.query('DROP TABLE "pullrequests"', undefined);
    }
}
