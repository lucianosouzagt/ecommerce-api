"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const Order_1 = require("../database/entities/Order"); // Ajuste o caminho
const database_1 = require("../database"); // Ajuste o caminho
exports.OrderRepository = database_1.AppDataSource.getRepository(Order_1.Order);
// Exemplo de um método customizado (para adicionar no futuro, se necessário)
/*
export const OrderRepositoryWithCustomMethods = OrderRepository.extend({
    findOrdersByClientId(clientId: string) {
        return this.find({ where: { client_id: clientId }, relations: ['client', 'items'] });
    }
});
*/ 
