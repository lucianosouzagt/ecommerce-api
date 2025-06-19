import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Order } from "./Order"; // Importa a entidade Order

@Entity("clients") // Nome da tabela em inglês
export class Client {
    @PrimaryGeneratedColumn("uuid")
    id!: string; // UUID primary key

    @Column({ type: "varchar", length: 255, nullable: false })
    name!: string; // Nome em inglês

    @Column({ type: "varchar", length: 255, unique: true, nullable: false })
    email!: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    phone!: string | null; // Nome em inglês

    @Column({ type: "boolean", default: true, nullable: false })
    active!: boolean; // Nome em inglês

    @CreateDateColumn()
    created_at!: Date; // Nome em inglês

    @UpdateDateColumn()
    updated_at!: Date; // Nome em inglês

    @Column({ type: "uuid", nullable: true })
    updated_by!: string | null; // Nome em inglês

    // Relacionamento: Um cliente pode ter muitos pedidos (orders)
    @OneToMany(() => Order, order => order.client)
    orders!: Order[]; // Nome da propriedade em inglês
}