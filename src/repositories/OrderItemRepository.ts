// src/database/repositories/OrderItemRepository.ts
import { Repository } from 'typeorm';
import { AppDataSource } from '../database/index.js';
import { OrderItem } from '../database/entities/OrderItem.js';


interface ProductRepositoryCustom extends Repository<OrderItem> {
    findActiveProducts(): Promise<OrderItem[]>;
}
export const OrderItemRepository: Repository<OrderItem> = AppDataSource.getRepository(OrderItem);
