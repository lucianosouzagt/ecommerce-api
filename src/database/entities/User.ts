// src/database/entities/User.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { IsUUID, IsString, IsEmail, MinLength, MaxLength, IsBoolean, IsDate, IsIn } from 'class-validator'; // <-- Adicione os decoradores

import { Product } from './Product'; // Assumindo que Product tem createdBy/updatedBy
import { Client } from './Client';
import { Order } from './Order';
import { OrderItem } from './OrderItem';
import { StockMovement } from './StockMovement';

// Se preferir usar um Enum para os roles, defina-o aqui
// export enum UserRole { Admin = 'admin', User = 'user' }

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    @IsUUID()
    id!: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    @IsString()
    @MinLength(3)
    @MaxLength(255)
    name!: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    @IsString()
    @IsEmail()
    email!: string;

    @Column({ type: 'varchar', length: 255 }) // Senhas devem ser armazenadas hasheadas!
    @IsString()
    @MinLength(8) // <-- Exemplo: senha com no mínimo 8 caracteres
    password!: string;

    @Column({ type: 'varchar', length: 50, default: 'user' }) // Ex: 'admin', 'user'
    @IsString()
    @IsIn(['admin', 'user']) // <-- Validar que o role está na lista permitida
    role!: string; // Poderia ser UserRole se usasse Enum

    @Column({ type: 'boolean', default: true })
    @IsBoolean()
    isActive!: boolean;

    // Relações com produtos criados/atualizados por este usuário (opcional, dependendo se Product tem FK para User)
    @OneToMany(() => Product, product => product.updated_by)
    updatedProducts!: Product[];

    @OneToMany(() => Client, client => client.updated_by)
    updatedClients!: Client[];
    
    @OneToMany(() => Order, order => order.updated_by)
    updatedOrders!: Order[];
    
    @OneToMany(() => OrderItem, orderItem => orderItem.updated_by)
    updatedOrdeItens!: OrderItem[];
    
    @OneToMany(() => StockMovement, stockMovement => stockMovement.updated_by)
    updatedStockMovement!: StockMovement[];
        
    @OneToMany(() => User, user => user.updated_by)
    updatedUsers!: User[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @IsDate()
    created_at!: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    @IsDate()
    updated_at!: Date;

    @Column({ type: 'varchar', length: 50, default: '' }) // Ex: 'admin', 'user'
    @IsString()
    updated_by!: string | null; // Pode ser null se updated_by_id for null
}