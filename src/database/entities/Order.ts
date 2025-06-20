// src/database/entities/Order.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { IsUUID, IsString, IsNumber, IsPositive, IsDate, MinLength, MaxLength } from 'class-validator'; // <-- Adicione os decoradores

import { Client } from './Client';
import { OrderItem } from './OrderItem';
import { User } from './User';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    @IsUUID()
    id!: string;

    @Column({ type: 'uuid' })
    @IsUUID()
    client_id!: string; // Validar o FK diretamente

    @ManyToOne(() => Client, client => client.orders)
    @JoinColumn({ name: 'client_id' })
    client!: Client; // Relação

    @Column({ type: 'timestamp' }) // Data do pedido (quando foi feito)
    @IsDate()
    orderDate!: Date;

    @Column({ type: 'varchar', length: 50 }) // Ex: 'Pending', 'Processing', 'Completed', 'Cancelled'
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    status!: string; // Poderia usar @IsIn(['Pending', 'Processing', ...]) se usar um enum/lista fixa

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @IsNumber()
    @IsPositive()
    totalAmount!: number; // Validar que o total é positivo

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    items!: OrderItem[]; // Relação

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