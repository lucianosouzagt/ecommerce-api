import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Client } from './Client';
import { OrderItem } from './OrderItem';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Client, { eager: true })
    @JoinColumn({ name: 'client_id' })
    client!: Client;

    @Column('decimal', { precision: 10, scale: 2 })
    total!: number;

    @Column()
    status!: string;

    @OneToMany(() => OrderItem, item => item.order, { cascade: true, eager: true })
    items!: OrderItem[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
