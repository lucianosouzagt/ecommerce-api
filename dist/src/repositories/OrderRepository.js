import { AppDataSource } from '../database/index.js';
import { Order } from '../database/entities/Order.js';
export const OrderRepository = AppDataSource.getRepository(Order);
