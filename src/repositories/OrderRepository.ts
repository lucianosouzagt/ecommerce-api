// src/database/repositories/OrderRepository.ts
import { Repository } from 'typeorm';
import { Order } from '../database/entities/Order'; // Ajuste o caminho
import { AppDataSource } from '../database'; // Ajuste o caminho

export const OrderRepository: Repository<Order> = AppDataSource.getRepository(Order);

// Exemplo de um método customizado (para adicionar no futuro, se necessário)
/*
export const OrderRepositoryWithCustomMethods = OrderRepository.extend({
    findOrdersByClientId(clientId: string) {
        return this.find({ where: { client_id: clientId }, relations: ['client', 'items'] });
    }
});
*/