// src/database/entities/Client.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,JoinColumn,OneToMany } from 'typeorm';
import { IsUUID, IsString, IsEmail, IsBoolean, IsOptional, MinLength, MaxLength, IsDate } from 'class-validator'; // <-- Adicione os decoradores

import { Order } from './Order';
import { User } from './User';

@Entity('clients')
export class Client {
    @PrimaryGeneratedColumn('uuid')
    @IsUUID()
    id!: string;

    @Column({ type: 'varchar', length: 255 })
    @IsString()
    @MinLength(3)
    @MaxLength(255)
    name!: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    @IsString()
    @IsEmail() // <-- Decorador para validar formato de email
    email!: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    @IsOptional() // <-- Marque como opcional se o campo é nullable
    @IsString()
    phone: string | null = null;

    @Column({ type: 'text', nullable: true })
    @IsOptional()
    @IsString()
    address: string | null = null;

    @Column({ type: 'boolean', default: true })
    @IsBoolean()
    isActive!: boolean;

    @OneToMany(() => Order, order => order.client)
    orders!: Order[]; // Relação, não precisa de decorador de validação aqui

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