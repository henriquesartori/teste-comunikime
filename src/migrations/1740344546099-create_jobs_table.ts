import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateJobsTable1740344546099 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
                    new Table({
                        name: 'jobs',
                        columns: [
                            {
                                name: 'id',
                                type: 'int',
                                isPrimary: true,
                                isGenerated: true,
                                generationStrategy: 'increment'
                            },
                            {
                                name: 'job_id',
                                type: 'int',
                                isNullable: false
                            },
                            {
                                name: 'name',
                                type: 'varchar(255)',
                                isNullable: false
                            },
                            {
                                name: 'status',
                                type: 'varchar(255)',
                                isNullable: false
                            },
                            {
                                name: 'error',
                                type: 'varchar(max)',
                                isNullable: true
                            },
                            {
                                name: 'created_at',
                                type: 'datetime2',
                                default: "GETDATE()",
                            },
                            {
                                name: 'updated_at',
                                type: 'datetime2',
                                default: "GETDATE()",
                                onUpdate: "GETDATE()",
                            }
                        ]
                    })
                )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('jobs')
    }

}
