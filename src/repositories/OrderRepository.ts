// src/database/repositories/OrderRepository.ts
import { Repository } from 'typeorm';
import { AppDataSource } from '../database/index.js'; 
import { Order } from '../database/entities/Order.js'; 

export const OrderRepository: Repository<Order> = AppDataSource.getRepository(Order);
