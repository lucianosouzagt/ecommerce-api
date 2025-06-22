"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = exports.OrderService = void 0;
const database_1 = require("../database");
const Order_1 = require("../database/entities/Order");
const CreateOrderDTO_1 = require("../dtos/orders/CreateOrderDTO");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const Client_1 = require("../database/entities/Client");
const Product_1 = require("../database/entities/Product");
const OrderItem_1 = require("../database/entities/OrderItem");
class OrderService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository || database_1.AppDataSource.getRepository(Order_1.Order);
        this.productRepository = database_1.AppDataSource.getRepository(Product_1.Product);
    }
    async create(orderData) {
        const dto = (0, class_transformer_1.plainToInstance)(CreateOrderDTO_1.CreateOrderDTO, orderData);
        const errors = await (0, class_validator_1.validate)(dto);
        if (errors.length > 0) {
            const messages = errors.map(err => Object.values(err.constraints || {})).flat();
            throw new Error(`Dados do pedido inválidos: ${messages.join(', ')}`);
        }
        const clientRepo = database_1.AppDataSource.getRepository(Client_1.Client);
        const client = await clientRepo.findOneBy({ id: orderData.clientId });
        if (!client)
            throw new Error('Cliente não encontrado.');
        const items = [];
        let total = 0;
        for (const itemData of orderData.items) {
            const product = await this.productRepository.findOneBy({ id: itemData.productId });
            if (!product)
                throw new Error(`Produto ${itemData.productId} não encontrado.`);
            if (product.stock < itemData.quantity) {
                throw new Error(`Estoque insuficiente para o produto: ${product.name}`);
            }
            const unitPrice = parseFloat(product.price.toString());
            const totalPrice = unitPrice * itemData.quantity;
            // Atualiza estoque
            product.stock -= itemData.quantity;
            await this.productRepository.save(product);
            const orderItem = new OrderItem_1.OrderItem();
            orderItem.product = product;
            orderItem.quantity = itemData.quantity;
            orderItem.unitPrice = unitPrice;
            orderItem.totalPrice = totalPrice;
            items.push(orderItem);
            total += totalPrice;
        }
        const order = this.orderRepository.create({
            client,
            status: orderData.status,
            total,
            items,
        });
        return await this.orderRepository.save(order);
    }
    async findById(id) {
        return this.orderRepository.findOneBy({ id });
    }
    async findAll() {
        return this.orderRepository.find();
    }
    async update(id, data) {
        const order = await this.orderRepository.findOneBy({ id });
        if (!order)
            return null;
        // Neste exemplo não atualizamos itens nem cliente — só status
        this.orderRepository.merge(order, {
            status: data.status ?? order.status,
        });
        return await this.orderRepository.save(order);
    }
    async delete(id) {
        const result = await this.orderRepository.delete(id);
        return !!result.affected && result.affected > 0;
    }
}
exports.OrderService = OrderService;
exports.orderService = new OrderService();
