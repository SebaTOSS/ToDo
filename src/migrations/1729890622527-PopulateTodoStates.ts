import { MigrationInterface, QueryRunner } from "typeorm";

export class PopulateTodoStates1729890622527 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO to_do_state (id, name, description) VALUES
            (1, 'Backlog', 'Tasks to be done'),
            (2, 'Pending', 'Tasks pending to be done'),
            (3, 'In Progress', 'Tasks in progress'),
            (4, 'Completed', 'Tasks completed'),
            (5, 'Cancelled', 'Tasks cancelled');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM to_do_state WHERE id IN (1, 2, 3, 4);
        `);
    }

}
