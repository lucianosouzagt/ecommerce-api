// src/database/entities/StockMovement.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsUUID, IsDate, IsString, IsNumber, Min, IsIn } from 'class-validator'; // <-- Adicione os decoradores

import { Product } from './Product';
import { User } from './User';
import { OrderItem } from './OrderItem'; 
// Se preferir usar um Enum para os tipos de movimento, defina-o aqui
// export enum MovementType { In = 'in', Out = 'out' }

@Entity('stock_movements')
export class StockMovement {
    @PrimaryGeneratedColumn('uuid')
    @IsUUID()
    id!: string;

    @Column({ type: 'uuid' })
    @IsUUID()
    product_id!: string; // Validar FK

    @ManyToOne(() => Product, product => product.stockMovements)
    @JoinColumn({ name: 'product_id' })
    product!: Product; // Relação

    @ManyToOne(() => OrderItem, orderItem => orderItem.stockMovements, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'orderItem_id' })
    orderItem!: OrderItem;

    @Column({ type: 'timestamp' }) // Data do movimento
    @IsDate()
    movementDate!: Date;

    @Column({ type: 'varchar', length: 10 }) // 'in' ou 'out'
    @IsString()
    @IsIn(['in', 'out']) // <-- Validar que o valor está na lista permitida
    type!: string; // Poderia ser MovementType se usasse Enum

    @Column({ type: 'int' })
    @IsNumber()
    @Min(1) // Quantidade mínima de 1 no movimento
    quantity!: number;

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