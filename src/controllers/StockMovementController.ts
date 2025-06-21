// src/controllers/StockMovementController.ts
import { Request, Response } from 'express';
import { stockMovementService } from '../services';
import { CreateStockMovementDTO } from '../dtos/stockMovements/CreateStockMovementDTO';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class StockMovementController {

    // Endpoint para registrar uma nova entrada ou ajuste manual de estoque
    async create(req: Request, res: Response): Promise<Response> {
        try {
            const movementData: CreateStockMovementDTO = req.body;

            // Validação: Permitir apenas certos tipos de movimento via API direta (ex: Entrada, Entrada/Saída Ajuste)
             if (movementData.movementType === 'Saída (Pedido)') {
                 return res.status(400).json({ message: 'Movimentos do tipo "Saída (Pedido)" não podem ser criados diretamente pela API.' });
             }

            const movementDto = plainToInstance(CreateStockMovementDTO, movementData);
            const errors = await validate(movementDto);
            if (errors.length > 0) {
                return res.status(400).json({ message: 'Dados de entrada inválidos', errors });
            }

            const movement = await stockMovementService.create(movementData);
            return res.status(201).json(movement);
        } catch (error: any) {
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

    async findById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const movement = await stockMovementService.findById(id);

            if (!movement) {
                return res.status(404).json({ message: 'Movimento de estoque não encontrado' });
            }

            return res.status(200).json(movement);
        } catch (error) {
            console.error('Erro no StockMovementController.findById:', error);
            return res.status(500).json({ message: 'Erro interno ao buscar movimento de estoque' });
        }
    }

    async findAll(req: Request, res: Response): Promise<Response> {
        try {
            const movements = await stockMovementService.findAll();
            return res.status(200).json(movements);
        } catch (error) {
            console.error('Erro no StockMovementController.findAll:', error);
            return res.status(500).json({ message: 'Erro interno ao listar movimentos de estoque' });
        }
    }

     // Endpoint para listar movimentos de estoque por produto
     async findByProductId(req: Request, res: Response): Promise<Response> {
        try {
            const { productId } = req.params;
            const movements = await stockMovementService.findByProductId(productId);
            return res.status(200).json(movements);
        } catch (error) {
            console.error('Erro no StockMovementController.findByProductId:', error);
            return res.status(500).json({ message: 'Erro interno ao listar movimentos de estoque por produto' });
        }
     }

    // Métodos update e delete geralmente não existem para movimentos de estoque via API direta.
}