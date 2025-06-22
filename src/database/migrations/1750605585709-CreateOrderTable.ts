import type { MigrationInterface, QueryRunner } from "typeorm"; 
import { Table } from "typeorm/schema-builder/table/Table.js";
import { TableForeignKey } from "typeorm/schema-builder/table/TableForeignKey.js"


TableForeignKey

export class CreateOrderTable1750605585709 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "orders",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    default: "uuid_generate_v4()" // Para PostgreSQL. Certifique-se de que a extensão 'uuid-ossp' está habilitada.
                },
                {
                    name: "client_id", // Coluna para a chave estrangeira
                    type: "uuid",
                    isNullable: false // Uma ordem deve sempre ter um cliente
                },
                {
                    name: "total",
                    type: "numeric", // 'decimal' no TypeORM é 'numeric' no PostgreSQL
                    precision: 10,
                    scale: 2,
                    isNullable: false
                },
                {
                    name: "status",
                    type: "varchar",
                    length: "50", // Defina um comprimento adequado para o status (ex: 'pending', 'completed')
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

        // Adiciona a chave estrangeira para a tabela de clientes
        // Isso cria a relação entre 'orders.client_id' e 'clients.id'
        await queryRunner.createForeignKey("orders", new TableForeignKey({
            columnNames: ["client_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "clients",
            onDelete: "RESTRICT" // Define o comportamento em caso de exclusão do cliente.
                                 // 'RESTRICT': Não permite deletar cliente se houver pedidos associados.
                                 // 'CASCADE': Deleta os pedidos se o cliente for deletado.
                                 // 'SET NULL': Define 'client_id' como NULL se o cliente for deletado (necessita que 'client_id' seja nullable).
                                 // Escolha o que faz sentido para sua regra de negócio.
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Obter a tabela 'orders' para encontrar a chave estrangeira
        const table = await queryRunner.getTable("orders");
        // Encontrar a chave estrangeira pelo nome da coluna que a referencia
        const foreignKey = table!.foreignKeys.find(fk => fk.columnNames.indexOf("client_id") !== -1);
        
        // Se a chave estrangeira for encontrada, removê-la
        if (foreignKey) {
            await queryRunner.dropForeignKey("orders", foreignKey);
        }
        
        // Finalmente, remover a tabela 'orders'
        await queryRunner.dropTable("orders");
    }

}
