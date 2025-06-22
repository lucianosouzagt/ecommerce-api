import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Client } from './Client.js';
import { OrderItem } from './OrderItem.js';

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

    @OneToMany(() => OrderItem, item => item.order)
    items!: OrderItem[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at!: Date;
}
