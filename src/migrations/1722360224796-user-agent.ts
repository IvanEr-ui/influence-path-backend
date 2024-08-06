import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UserAgent1722360224796 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('token', new TableColumn({
            name: 'userAgent',
            type: 'varchar',
            isNullable: false
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('token', 'userAgent');
    }

}
