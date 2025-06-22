import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './Order';
import { Product } from './Product';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order!: Order;

    @ManyToOne(() => Product, { eager: true })
    @JoinColumn({ name: 'product_id' })
    product!: Product;

    @Column('int')
    quantity!: number;

    @Column('decimal', { precision: 10, scale: 2 })
    unitPrice!: number;

    @Column('decimal', { precision: 10, scale: 2 })
    totalPrice!: number;
}
