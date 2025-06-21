// src/database/repositories/OrderItemRepository.ts
import { Repository } from 'typeorm';
import { OrderItem } from '../database/entities/OrderItem'; // Ajuste o caminho
import { AppDataSource } from '../database'; // Ajuste o caminho

// Definir a interface para os métodos customizados
interface ProductRepositoryCustom extends Repository<OrderItem> {
    findActiveProducts(): Promise<OrderItem[]>;
    // Adicione outras declarações de método aqui
}
export const OrderItemRepository: Repository<OrderItem> = AppDataSource.getRepository(OrderItem);

// Normalmente, OrderItemRepository não terá muitos métodos customizados
// complexos, pois OrderItems são frequentemente gerenciados via relacionamentos
// com Order ou Product, mas você pode adicionar se precisar de algo específico.
/*
export const OrderItemRepositoryWithCustomMethods = OrderItemRepository.extend({
    findItemsForOrder(orderId: string) {
        return this.find({ where: { order_id: orderId }, relations: ['product'] });
    }
});
*/