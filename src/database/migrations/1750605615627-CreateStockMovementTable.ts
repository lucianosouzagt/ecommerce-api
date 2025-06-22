import type { MigrationInterface, QueryRunner } from "typeorm"; 
import { Table } from "typeorm/schema-builder/table/Table.js";
import { TableForeignKey } from "typeorm/schema-builder/table/TableForeignKey.js"

export class CreateStockMovementTable1750605615627 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "stock_movements",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    default: "uuid_generate_v4()" // Para PostgreSQL
                },
                {
                    name: "product_id", // Coluna para a chave estrangeira de Product
                    type: "uuid",
                    isNullable: false
                },
                {
                    name: "quantity",
                    type: "integer", // 'int' no TypeORM mapeia para 'integer'
                    isNullable: false
                },
                {
                    name: "type",
                    type: "varchar",
                    length: "50", // Defina um comprimento adequado para os tipos 'entrada', 'saida', 'ajuste'
                    isNullable: false
                },
                {
                    name: "description",
                    type: "text", // 'text' para descrições, que podem ser longas
                    isNullable: true // Corresponde ao `nullable: true` na entidade
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

        // Adiciona a chave estrangeira para a tabela 'products'
        await queryRunner.createForeignKey("stock_movements", new TableForeignKey({
            columnNames: ["product_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "products",
            onDelete: "RESTRICT" // Impede a exclusão de um produto se ele tiver movimentos de estoque associados.
                                  // Geralmente é uma boa prática para histórico de estoque.
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("stock_movements");

        // Remove a chave estrangeira de 'product_id'
        const productForeignKey = table!.foreignKeys.find(fk => fk.columnNames.indexOf("product_id") !== -1);
        if (productForeignKey) {
            await queryRunner.dropForeignKey("stock_movements", productForeignKey);
        }
        
        // Finalmente, remove a tabela 'stock_movements'
        await queryRunner.dropTable("stock_movements");
    }

}
