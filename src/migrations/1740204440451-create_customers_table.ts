import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCustomersTable1740204440451 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'customers',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'uuid',
                        type: 'varchar(36)',
                        isNullable: false
                    },
                    {
                        name: 'name',
                        type: 'varchar(255)',
                        isNullable: false
                    },
                    {
                        name: 'birthDate',
                        type: 'datetime2',
                        isNullable: false
                    },
                    {
                        name: 'gender',
                        type: 'varchar(255)',
                        isNullable: false
                    },
                    {
                        name: 'email',
                        type: 'varchar(255)',
                        isNullable: false
                    },
                    {
                        name: 'phone',
                        type: 'varchar(255)',
                        isNullable: false
                    },
                    {
                        name: 'address',
                        type: 'varchar(255)',
                        isNullable: false
                    },
                    {
                        name: 'city',
                        type: 'varchar(255)',
                        isNullable: false
                    },
                    {
                        name: 'state',
                        type: 'varchar(255)',
                        isNullable: false
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
        await queryRunner.dropTable('customers')
    }

}