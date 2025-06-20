// src/services/OrderItemService.ts
import { OrderItem } from '../database/entities/OrderItem';
import AppDataSource from '../database';

// DTOs (se necessário para operações diretas, menos comum)
// import { CreateOrderItemDTO } from '../dtos/orderItems/CreateOrderItemDTO';
// import { UpdateOrderItemDTO } from '../dtos/orderItems/UpdateOrderItemDTO';

const orderItemRepository = AppDataSource.getRepository(OrderItem);

export class OrderItemService {

    // Métodos CRUD básicos - **Nota:** A lógica de negócio de e-commerce
    // frequentemente impede ou restringe a manipulação direta de OrderItems
    // fora do contexto de um Order.

    // async create(itemData: CreateOrderItemDTO): Promise<OrderItem> { /* ... */ }
    // async update(id: string, updateData: UpdateOrderItemDTO): Promise<OrderItem | null> { /* ... */ }
    // async delete(id: string): Promise<boolean> { /* ... */ }

    /**
     * Busca um item de pedido pelo ID.
     * @param id ID do item de pedido (UUID).
     * @returns O item de pedido encontrado ou null.
     */
    async findById(id: string): Promise<OrderItem | null> {
        return await orderItemRepository.findOne({
            where: { id },
            relations: ['product', 'order'] // Inclui o produto e o pedido pai
        });
    }

    /**
     * Lista todos os itens de pedido (ou por pedido pai, produto, etc.).
     * @returns Array de itens de pedido.
     */
    async findAll(): Promise<OrderItem[]> {
        return await orderItemRepository.find({ relations: ['order'] }); // Exemplo: inclui apenas o pedido pai
    }

     /**
      * Lista itens de pedido associados a um pedido específico.
      * @param orderId ID do pedido pai.
      * @returns Array de itens de pedido do pedido pai.
      */
     async findByOrderId(orderId: string): Promise<OrderItem[]> {
        return await orderItemRepository.find({
            where: { order: { id: orderId } }, // Filtra pelo ID do pedido associado
            relations: ['product']
        });
     }
}

// Exportar uma instância padrão
export const orderItemService = new OrderItemService();