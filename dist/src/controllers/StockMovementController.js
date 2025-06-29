import { StockMovementService } from '../services/StockMovementService.js';
export class StockMovementController {
    stockMovementService;
    constructor(stockMovementService) {
        this.stockMovementService = stockMovementService || new StockMovementService();
    }
    async create(req, res) {
        try {
            const movement = await this.stockMovementService.create(req.body);
            return res.status(201).json(movement);
        }
        catch (error) {
            console.error('Erro ao registrar movimentação:', error);
            return res.status(400).json({ message: error.message });
        }
    }
    async findAll(req, res) {
        try {
            const movements = await this.stockMovementService.findAll();
            return res.status(200).json(movements);
        }
        catch (error) {
            console.error('Erro ao buscar movimentações:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
    async findByProduct(req, res) {
        try {
            const movements = await this.stockMovementService.findByProduct(req.params.id);
            return res.status(200).json(movements);
        }
        catch (error) {
            console.error('Erro ao buscar movimentações por produto:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
}
