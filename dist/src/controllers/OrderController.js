"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const services_1 = require("../services");
const CreateOrderDTO_1 = require("../dtos/orders/CreateOrderDTO");
const UpdateOrderDTO_1 = require("../dtos/orders/UpdateOrderDTO");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class OrderController {
    async create(req, res) {
        try {
            const orderData = req.body;
            const orderDto = (0, class_transformer_1.plainToInstance)(CreateOrderDTO_1.CreateOrderDTO, orderData);
            const errors = await (0, class_validator_1.validate)(orderDto);
            if (errors.length > 0) {
                return res.status(400).json({ message: 'Dados de entrada do pedido inválidos', errors });
            }
            const order = await services_1.orderService.create(orderData);
            return res.status(201).json(order);
        }
        catch (error) {
            console.error('Erro no OrderController.create:', error);
            // Tratar erros específicos vindos do OrderService
            if (error.message.includes('Cliente com ID') || error.message.includes('Produto(s) com IDs')) {
                return res.status(404).json({ message: error.message }); // Cliente ou Produto não encontrado
            }
            if (error.message.includes('Estoque insuficiente')) {
                return res.status(409).json({ message: error.message }); // Conflito de estoque
            }
            if (error.message.includes('Dados do pedido inválidos') || error.message.includes('Dados do item do pedido inválidos')) {
                return res.status(400).json({ message: error.message }); // Validação no service
            }
            return res.status(500).json({ message: 'Erro interno ao criar pedido' });
        }
    }
    async findById(req, res) {
        try {
            const { id } = req.params;
            const order = await services_1.orderService.findById(id); // Service inclui itens, produtos e cliente
            if (!order) {
                return res.status(404).json({ message: 'Pedido não encontrado' });
            }
            return res.status(200).json(order); // Retorna o pedido com suas relações
        }
        catch (error) {
            console.error('Erro no OrderController.findById:', error);
            return res.status(500).json({ message: 'Erro interno ao buscar pedido' });
        }
    }
    async findByClientId(req, res) {
        try {
            const { clientId } = req.params;
            const orders = await services_1.orderService.findByClientId(clientId); // Service busca por cliente
            return res.status(200).json(orders); // Retorna array de pedidos do cliente
        }
        catch (error) {
            console.error('Erro no OrderController.findByClientId:', error);
            return res.status(500).json({ message: 'Erro interno ao buscar pedidos por cliente' });
        }
    }
    async findAll(req, res) {
        try {
            const orders = await services_1.orderService.findAll(); // Service pode incluir cliente
            return res.status(200).json(orders);
        }
        catch (error) {
            console.error('Erro no OrderController.findAll:', error);
            return res.status(500).json({ message: 'Erro interno ao listar pedidos' });
        }
    }
    // Exemplo: Endpoint para atualizar apenas o status do pedido
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body; // Espera { status: 'Novo Status' }
            const orderDto = (0, class_transformer_1.plainToInstance)(UpdateOrderDTO_1.UpdateOrderDTO, updateData);
            const errors = await (0, class_validator_1.validate)(orderDto);
            if (errors.length > 0) {
                // Validar que apenas o campo 'status' está presente, se for o caso
                // ou apenas validar o próprio DTO UpdateOrderDTO que já tem @IsOptional
                return res.status(400).json({ message: 'Dados de atualização inválidos', errors });
            }
            const updatedOrder = await services_1.orderService.updateStatus(id, updateData);
            if (!updatedOrder) {
                return res.status(404).json({ message: 'Pedido não encontrado' });
            }
            return res.status(200).json(updatedOrder);
        }
        catch (error) {
            console.error('Erro no OrderController.updateStatus:', error);
            if (error.message.includes('inválidos') || error.message.includes('status')) { // Validar status ou outros campos
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno ao atualizar status do pedido' });
        }
    }
    // A exclusão de pedidos geralmente é restrita ou não permitida.
    // Se permitida (ex: apenas status Pendente), o controller chamaria o service.delete
    async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await services_1.orderService.delete(id); // Service lida com regras de exclusão
            if (!deleted) {
                // Verificar se existe para retornar 404 ou 409
                const order = await services_1.orderService.findById(id);
                if (!order) {
                    return res.status(404).json({ message: 'Pedido não encontrado' });
                }
                else {
                    // Se existe mas não deletou, o service deve ter lançado um erro com a razão
                    return res.status(409).json({ message: 'Não foi possível deletar o pedido' });
                }
            }
            return res.status(204).send(); // 204 No Content
        }
        catch (error) {
            console.error('Erro no OrderController.delete:', error);
            if (error.message.includes('Não é possível excluir um pedido com status')) { // Exemplo de erro do service
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno ao deletar pedido' });
        }
    }
}
exports.OrderController = OrderController;
