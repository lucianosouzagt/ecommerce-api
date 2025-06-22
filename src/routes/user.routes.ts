import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/UserController.js';

const router = Router();
const userController = new UserController();

router.get('/test', (req: Request, res: Response) => {
    res.send('Rota de usuário OK');
});

router.post('/', async (req, res, next) => {
    try {
        await userController.create(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        await userController.findAll(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        await userController.findById(req, res);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        await userController.update(req, res);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await userController.delete(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;
