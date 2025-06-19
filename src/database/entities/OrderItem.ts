import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "./Order"; // Importa a entidade Order
import { Product } from "./Product"; // Importa a entidade Product

@Entity("order_items") // Nome da tabela em inglês
export class OrderItem {
    @PrimaryGeneratedColumn("uuid")
    id!: string; // UUID primary key

    // Chave estrangeira para Order
    @ManyToOne(() => Order, order => order.items)
    @JoinColumn({ name: "order_id" }) // Opcional: especifica o nome da coluna FK no BD
    order!: Order; // Nome da propriedade em inglês

    @Column({ type: "uuid", nullable: false }) // Coluna explícita para FK
    order_id!: string;

    // Chave estrangeira para Product
    @ManyToOne(() => Product, product => product.orderItems)
    @JoinColumn({ name: "product_id" }) // Opcional: especifica o nome da coluna FK no BD
    product!: Product; // Nome da propriedade em inglês

    @Column({ type: "uuid", nullable: false }) // Coluna explícita para FK
    product_id!: string;

    @Column({ type: "int", nullable: false })
    quantity!: number; // Nome em inglês

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
    price!: number; // Nome em inglês (preço unitário no momento da compra)

    @CreateDateColumn()
    created_at!: Date; // Nome em inglês

    @UpdateDateColumn()
    updated_at!: Date; // Nome em inglês

    @Column({ type: "uuid", nullable: true })
    updated_by!: string | null; // Nome em inglês
}