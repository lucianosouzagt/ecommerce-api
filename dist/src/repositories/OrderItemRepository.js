import { AppDataSource } from '../database/index.js';
import { OrderItem } from '../database/entities/OrderItem.js';
export const OrderItemRepository = AppDataSource.getRepository(OrderItem);
