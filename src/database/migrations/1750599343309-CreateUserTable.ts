import type { MigrationInterface, QueryRunner } from "typeorm"; 
import { Table } from "typeorm/schema-builder/table/Table.js";


export class CreateUserTable1750599343309 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "users",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    default: "uuid_generate_v4()" // Para PostgreSQL. Certifique-se de que a extensão 'uuid-ossp' está habilitada no seu DB.
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "255",
                    isNullable: false
                },
                {
                    name: "email",
                    type: "varchar",
                    length: "255",
                    isUnique: true,
                    isNullable: false
                },
                {
                    name: "password", // Armazenará o hash da senha
                    type: "varchar",
                    length: "255",
                    isNullable: false
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "now()"
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }

}