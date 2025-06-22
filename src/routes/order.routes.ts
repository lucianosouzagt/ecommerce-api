import { Router, Request, Response, NextFunction } from 'express';
import { OrderController } from '../controllers/OrderController.js';

const router = Router();
const orderController = new OrderController();

router.get('/test', (req: Request, res: Response) => {
    res.send('Rota de pedidos OK');
});

router.post('/', async (req, res, next) => {
    try {
        await orderController.create(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        await orderController.findAll(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        await orderController.findById(req, res);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        await orderController.update(req, res);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await orderController.delete(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;
