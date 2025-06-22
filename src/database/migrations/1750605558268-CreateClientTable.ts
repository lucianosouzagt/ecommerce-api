import type { MigrationInterface, QueryRunner } from "typeorm"; 
import { Table } from "typeorm/schema-builder/table/Table.js";

export class CreateClientTable1750605558268 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "clients",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    default: "uuid_generate_v4()" // Para PostgreSQL. Certifique-se de que a extensão 'uuid-ossp' está habilitada.
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "255", // Defina um comprimento adequado para o nome
                    isNullable: false
                },
                {
                    name: "email",
                    type: "varchar",
                    length: "255", // Defina um comprimento adequado para o email
                    isUnique: true, // Corresponde ao `unique: true` na entidade
                    isNullable: false
                },
                {
                    name: "address",
                    type: "text", // Usado 'text' para endereço, que pode ser longo
                    isNullable: false // Corresponde ao `Column()` sem `nullable: true`
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
        await queryRunner.dropTable("clients");
    }

}
