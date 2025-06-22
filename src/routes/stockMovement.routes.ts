import { Router, Request, Response, NextFunction } from 'express';
import { StockMovementController } from '../controllers/StockMovementController';

const router = Router();
const stockMovementController = new StockMovementController();

router.get('/test', (req: Request, res: Response) => {
    res.send('Rota de movimentações de estoque OK');
});

router.post('/', async (req, res, next) => {
    try {
        await stockMovementController.create(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        await stockMovementController.findAll(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/product/:id', async (req, res, next) => {
    try {
        await stockMovementController.findByProduct(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;
