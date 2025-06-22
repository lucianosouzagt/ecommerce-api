"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const services_1 = require("../services");
class OrderController {
    constructor(orderService) {
        this.orderService = orderService || new services_1.OrderService();
    }
    async create(req, res) {
        try {
            const order = await this.orderService.create(req.body);
            return res.status(201).json(order);
        }
        catch (error) {
            if (error.message.includes('inválido') || error.message.includes('Cliente')) {
                return res.status(400).json({ message: error.message });
            }
            console.error('Erro ao criar pedido:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
    async findById(req, res) {
        try {
            const order = await this.orderService.findById(req.params.id);
            if (!order) {
                return res.status(404).json({ message: 'Pedido não encontrado.' });
            }
            return res.status(200).json(order);
        }
        catch (error) {
            console.error('Erro ao buscar pedido:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
    async findAll(req, res) {
        try {
            const orders = await this.orderService.findAll();
            return res.status(200).json(orders);
        }
        catch (error) {
            console.error('Erro ao listar pedidos:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
    async update(req, res) {
        try {
            const updated = await this.orderService.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ message: 'Pedido não encontrado para atualização.' });
            }
            return res.status(200).json(updated);
        }
        catch (error) {
            console.error('Erro ao atualizar pedido:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
    async delete(req, res) {
        try {
            const success = await this.orderService.delete(req.params.id);
            if (!success) {
                return res.status(404).json({ message: 'Pedido não encontrado para exclusão.' });
            }
            return res.status(204).send();
        }
        catch (error) {
            console.error('Erro ao deletar pedido:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
}
exports.OrderController = OrderController;
