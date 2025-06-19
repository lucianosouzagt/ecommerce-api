import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { OrderItem } from "./OrderItem"; // Importa a entidade OrderItem
import { StockMovement } from "./StockMovement"; // Importa a entidade StockMovement

@Entity("products") // Nome da tabela em inglês
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id!: string; // UUID primary key

    @Column({ type: "varchar", length: 255, nullable: false })
    name!: string; // Nome em inglês

    @Column({ type: "text", nullable: true })
    description!: string | null; // Nome em inglês

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
    price!: number; // Nome em inglês

    @Column({ type: "varchar", length: 255, nullable: true })
    barcode!: string | null; // Nome em inglês

    @CreateDateColumn()
    created_at!: Date; // Nome em inglês

    @UpdateDateColumn()
    updated_at!: Date; // Nome em inglês

    @Column({ type: "uuid", nullable: true })
    updated_by!: string | null; // Nome em inglês

    // Relacionamento: Um produto pode estar em muitos itens de pedido (order_items)
    @OneToMany(() => OrderItem, item => item.product)
    orderItems!: OrderItem[]; // Nome da propriedade em inglês

    // Relacionamento: Um produto pode ter muitas movimentações de estoque (stock_movements)
    @OneToMany(() => StockMovement, movement => movement.product)
    stockMovements!: StockMovement[]; // Nome da propriedade em inglês
}