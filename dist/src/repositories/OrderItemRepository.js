"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItemRepository = void 0;
const OrderItem_1 = require("../database/entities/OrderItem"); // Ajuste o caminho
const database_1 = __importDefault(require("../database")); // Ajuste o caminho
exports.OrderItemRepository = database_1.default.getRepository(OrderItem_1.OrderItem);
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
