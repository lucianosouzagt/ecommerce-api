import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './Product';

@Entity('stock_movements')
export class StockMovement {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Product, { eager: true })
    @JoinColumn({ name: 'product_id' })
    product!: Product;

    @Column('int')
    quantity!: number;

    @Column()
    type!: 'entrada' | 'saida' | 'ajuste';

    @Column({ nullable: true })
    description?: string;

    @CreateDateColumn()
    createdAt!: Date;
}
