import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./Product"; // Importa a entidade Product

@Entity("stock_movements") // Nome da tabela em inglês
export class StockMovement {
    @PrimaryGeneratedColumn("uuid")
    id!: string; // UUID primary key

    // Chave estrangeira para Product
    @ManyToOne(() => Product, product => product.stockMovements)
    @JoinColumn({ name: "product_id" }) // Opcional: especifica o nome da coluna FK no BD
    product!: Product; // Nome da propriedade em inglês

    @Column({ type: "uuid", nullable: false }) // Coluna explícita para FK
    product_id!: string;

    @Column({ type: "varchar", length: 50, nullable: false })
    type!: string; // Nome em inglês (ex: 'entry', 'exit')

    @Column({ type: "int", nullable: false })
    quantity!: number; // Nome em inglês (quantidade movimentada)

    @Column({ type: "text", nullable: true })
    reason!: string | null; // Nome em inglês (motivo da movimentação)

    @CreateDateColumn()
    created_at!: Date; // Nome em inglês

    @UpdateDateColumn()
    updated_at!: Date; // Nome em inglês

    @Column({ type: "uuid", nullable: true })
    updated_by!: string | null; // Nome em inglês
}