import type { MigrationInterface, QueryRunner } from "typeorm"; 
import { Table } from "typeorm/schema-builder/table/Table.js";

export class CreateProductTable1750605565888 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "products",
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
                    length: "255", // Defina um comprimento para varchar
                    isNullable: false
                },
                {
                    name: "description",
                    type: "text", // Usado 'text' para descrições, permite mais caracteres que varchar sem limite fixo
                    isNullable: true
                },
                {
                    name: "price",
                    type: "numeric", // 'decimal' no TypeORM é 'numeric' no PostgreSQL
                    precision: 10,
                    scale: 2,
                    isNullable: false
                },
                {
                    name: "stock",
                    type: "integer", // 'int' no TypeORM é 'integer' no PostgreSQL
                    isNullable: false,
                    default: 0 // Definindo um valor padrão para o estoque inicial
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()" // `CURRENT_TIMESTAMP` mapeia para `now()` no PostgreSQL
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "now()" // `CURRENT_TIMESTAMP` mapeia para `now()` no PostgreSQL
                    // onUpdate não é definido diretamente na migration, é tratado pelo TypeORM na entidade
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("products");
    }

}
