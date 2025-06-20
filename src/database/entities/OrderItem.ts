// src/database/entities/OrderItem.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { IsUUID, IsNumber, IsPositive, Min, IsDate } from 'class-validator'; // <-- Adicione os decoradores

import { Order } from './Order';
import { Product } from './Product';
import { User } from './User';
import { StockMovement } from './StockMovement';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    @IsUUID()
    id!: string;

    @Column({ type: 'uuid' })
    @IsUUID()
    order_id!: string; // Validar FK

    @Column({ type: 'uuid' })
    @IsUUID()
    product_id!: string; // Validar FK

    @Column({ type: 'int' })
    @IsNumber()
    @IsPositive()
    @Min(1) // Quantidade mínima de 1 item
    quantity!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @IsNumber()
    @IsPositive() // Preço unitário deve ser positivo
    unitPrice!: number;

    @ManyToOne(() => Order, order => order.items)
    @JoinColumn({ name: 'order_id' })
    order!: Order; // Relação

    @ManyToOne(() => Product, product => product.orderItems)
    @JoinColumn({ name: 'product_id' })
    product!: Product; // Relação

     @OneToMany(() => StockMovement, stockMovement => stockMovement.orderItem)
    stockMovements!: StockMovement[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @IsDate()
    created_at!: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    @IsDate()
    updated_at!: Date;

    @ManyToOne(() => User, { nullable: true }) // Relacionamento com User (atualizador)
    @JoinColumn({ name: 'updated_by' })
    updated_by!: User | null; // Pode ser null se updated_by_id for null
}