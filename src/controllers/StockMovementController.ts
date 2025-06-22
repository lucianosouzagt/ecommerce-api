import { Request, Response } from 'express';
import { StockMovementService } from '../services/StockMovementService.js';

export class StockMovementController {
    private stockMovementService: StockMovementService;

    constructor(stockMovementService?: StockMovementService) {
        this.stockMovementService = stockMovementService || new StockMovementService();
    }

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const movement = await this.stockMovementService.create(req.body);
            return res.status(201).json(movement);
        } catch (error: any) {
            console.error('Erro ao registrar movimentação:', error);
            return res.status(400).json({ message: error.message });
        }
    }

    async findAll(req: Request, res: Response): Promise<Response> {
        try {
            const movements = await this.stockMovementService.findAll();
            return res.status(200).json(movements);
        } catch (error: any) {
            console.error('Erro ao buscar movimentações:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }

    async findByProduct(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {
            const movements = await this.stockMovementService.findByProduct(req.params.id);
            return res.status(200).json(movements);
        } catch (error: any) {
            console.error('Erro ao buscar movimentações por produto:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
}
