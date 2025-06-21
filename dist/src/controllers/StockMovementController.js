"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockMovementController = void 0;
const services_1 = require("../services");
const CreateStockMovementDTO_1 = require("../dtos/stockMovements/CreateStockMovementDTO");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class StockMovementController {
    // Endpoint para registrar uma nova entrada ou ajuste manual de estoque
    async create(req, res) {
        try {
            const movementData = req.body;
            // Validação: Permitir apenas certos tipos de movimento via API direta (ex: Entrada, Entrada/Saída Ajuste)
            if (movementData.movementType === 'Saída (Pedido)') {
                return res.status(400).json({ message: 'Movimentos do tipo "Saída (Pedido)" não podem ser criados diretamente pela API.' });
            }
            const movementDto = (0, class_transformer_1.plainToInstance)(CreateStockMovementDTO_1.CreateStockMovementDTO, movementData);
            const errors = await (0, class_validator_1.validate)(movementDto);
            if (errors.length > 0) {
                return res.status(400).json({ message: 'Dados de entrada inválidos', errors });
            }
            const movement = await services_1.stockMovementService.create(movementData);
            return res.status(201).json(movement);
        }
        catch (error) {
            console.error('Erro no StockMovementController.create:', error);
            if (error.message.includes('não encontrado')) {
                return res.status(404).json({ message: error.message }); // Produto não encontrado
            }
            if (error.message.includes('inválidos')) {
                return res.status(400).json({ message: error.message }); // 400 Bad Request
            }
            return res.status(500).json({ message: 'Erro interno ao criar movimento de estoque' });
        }
    }
    async findById(req, res) {
        try {
            const { id } = req.params;
            const movement = await services_1.stockMovementService.findById(id);
            if (!movement) {
                return res.status(404).json({ message: 'Movimento de estoque não encontrado' });
            }
            return res.status(200).json(movement);
        }
        catch (error) {
            console.error('Erro no StockMovementController.findById:', error);
            return res.status(500).json({ message: 'Erro interno ao buscar movimento de estoque' });
        }
    }
    async findAll(req, res) {
        try {
            const movements = await services_1.stockMovementService.findAll();
            return res.status(200).json(movements);
        }
        catch (error) {
            console.error('Erro no StockMovementController.findAll:', error);
            return res.status(500).json({ message: 'Erro interno ao listar movimentos de estoque' });
        }
    }
    // Endpoint para listar movimentos de estoque por produto
    async findByProductId(req, res) {
        try {
            const { productId } = req.params;
            const movements = await services_1.stockMovementService.findByProductId(productId);
            return res.status(200).json(movements);
        }
        catch (error) {
            console.error('Erro no StockMovementController.findByProductId:', error);
            return res.status(500).json({ message: 'Erro interno ao listar movimentos de estoque por produto' });
        }
    }
}
exports.StockMovementController = StockMovementController;
