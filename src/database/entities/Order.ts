import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Client } from "./Client"; // Importa a entidade Client
import { OrderItem } from "./OrderItem"; // Importa a entidade OrderItem

@Entity("orders") // Nome da tabela em inglês
export class Order {
    @PrimaryGeneratedColumn("uuid")
    id!: string; // UUID primary key

    // Chave estrangeira para Client
    @ManyToOne(() => Client, client => client.orders)
    @JoinColumn({ name: "client_id" }) // Opcional: especifica o nome da coluna FK no BD
    client!: Client; // Nome da propriedade em inglês

    @Column({ type: "uuid", nullable: false }) // Coluna explícita para FK
    client_id!: string;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
    total!: number;

    @Column({ type: "varchar", length: 50, nullable: false })
    status!: string; // Ex: 'pending', 'processing', 'shipped', 'delivered', 'cancelled'

    @CreateDateColumn()
    created_at!: Date; // Nome em inglês

    @UpdateDateColumn()
    updated_at!: Date; // Nome em inglês

    @Column({ type: "uuid", nullable: true })
    updated_by!: string | null; // Nome em inglês

    // Relacionamento: Um pedido (order) pode ter muitos itens de pedido (order_items)
    @OneToMany(() => OrderItem, item => item.order)
    items!: OrderItem[]; // Nome da propriedade em inglês (poderia ser orderItems também)
}