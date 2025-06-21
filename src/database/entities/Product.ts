import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,JoinColumn, OneToMany } from "typeorm"
import { IsUUID, IsString, IsNumber, IsPositive, IsBoolean, IsOptional, MinLength, MaxLength, IsDate } from 'class-validator'; // <--- Importe os decoradores

import { User } from './User';
import { OrderItem } from './OrderItem';
import { StockMovement } from './StockMovement';

@Entity('products') // Confirme o nome da tabela
export class Product {
    @PrimaryGeneratedColumn('uuid')
    @IsUUID() // <--- Decorador para validar que é um UUID
    id!: string; // Use o operador '!' pois o TypeORM gerencia a inicialização

    @Column({ type: 'varchar', length: 255, unique: true })
    @IsString()
    @MinLength(3)
    @MaxLength(255)
    name!: string;

    @Column({ type: 'text', nullable: true })
    @IsOptional() // Permite que este campo seja opcional na validação
    @IsString()
    description: string | null = null; // Inicialize com null se nullable é true

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    @IsNumber()
    @IsPositive() // Garante que o preço é positivo
    price!: number;

    @Column({ type: 'int', default: 0 }) // Considerar um campo para estoque atual?
    @IsNumber()
    @IsPositive({ message: 'Stock must be a non-negative number' }) // Estoque não pode ser negativo
    stock!: number; // Se o default for 0 e não for nullable, pode usar '!'

    @Column({ type: 'int', default: 0 }) // Considerar um campo para estoque minimo?
    @IsNumber()
    @IsPositive({ message: 'Stock must be a non-negative number' }) // Estoque minimo não pode ser negativo
    stock_min!: number; // Se o default for 0 e não for nullable, pode usar '!'

    @Column({ type: 'boolean', default: true })
    @IsBoolean()
    is_active!: boolean;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @IsDate() // Decorador para validar que é uma data
    created_at!: Date; // Definido pelo banco/TypeORM, use '!'

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    @IsDate() // Decorador para validar que é uma data
    updated_at!: Date; // Definido pelo banco/TypeORM, use '!'

    @ManyToOne(() => User, { nullable: true }) // Relacionamento com User (atualizador)
    @JoinColumn({ name: 'updated_by' })
    updated_by!: User | null; // Pode ser null se updated_by_id for null

    @OneToMany(() => OrderItem, orderItem => orderItem.product)
    orderItems!: OrderItem[]; // ! indica que o ORM vai inicializar, não precisa ser 'string | null'

    @OneToMany(() => StockMovement, stockMovement => stockMovement.product)
    stockMovements!: StockMovement[]; // ! indica que o ORM vai inicializar


}