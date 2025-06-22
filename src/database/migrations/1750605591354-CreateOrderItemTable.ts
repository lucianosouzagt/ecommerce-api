import type { MigrationInterface, QueryRunner } from "typeorm"; 
import { Table } from "typeorm/schema-builder/table/Table.js";
import { TableForeignKey } from "typeorm/schema-builder/table/TableForeignKey.js"

export class CreateOrderItemTable1750605591354 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "order_items",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    default: "uuid_generate_v4()" // Para PostgreSQL
                },
                {
                    name: "order_id", // Coluna para a chave estrangeira de Order
                    type: "uuid",
                    isNullable: false
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
                    name: "unit_price", // Corresponde a 'unitPrice' na entidade (snake_case para o DB)
                    type: "numeric", // 'decimal' no TypeORM mapeia para 'numeric'
                    precision: 10,
                    scale: 2,
                    isNullable: false
                },
                {
                    name: "total_price", // Corresponde a 'totalPrice' na entidade (snake_case para o DB)
                    type: "numeric",
                    precision: 10,
                    scale: 2,
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

        // Adiciona a chave estrangeira para a tabela 'orders'
        await queryRunner.createForeignKey("order_items", new TableForeignKey({
            columnNames: ["order_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "orders",
            onDelete: "CASCADE" // Se um pedido é deletado, seus itens de pedido também são.
        }));

        // Adiciona a chave estrangeira para a tabela 'products'
        await queryRunner.createForeignKey("order_items", new TableForeignKey({
            columnNames: ["product_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "products",
            onDelete: "RESTRICT" // Impede a exclusão de um produto se ele estiver em algum item de pedido.
                                  // Altere para 'SET NULL' ou 'CASCADE' se for outra regra de negócio.
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("order_items");

        // Remove a chave estrangeira de 'order_id'
        const orderForeignKey = table!.foreignKeys.find(fk => fk.columnNames.indexOf("order_id") !== -1);
        if (orderForeignKey) {
            await queryRunner.dropForeignKey("order_items", orderForeignKey);
        }

        // Remove a chave estrangeira de 'product_id'
        const productForeignKey = table!.foreignKeys.find(fk => fk.columnNames.indexOf("product_id") !== -1);
        if (productForeignKey) {
            await queryRunner.dropForeignKey("order_items", productForeignKey);
        }
        
        // Finalmente, remove a tabela 'order_items'
        await queryRunner.dropTable("order_items");
    }

}
