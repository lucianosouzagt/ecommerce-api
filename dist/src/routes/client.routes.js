// src/routes/client.routes.ts
import { Router } from 'express'; // Importar NextFunction
import { ClientController } from '../controllers/ClientController.js';
const router = Router();
const clientController = new ClientController();
console.log('controller', clientController);
// Handler de teste simples
router.get('/test', (req, res, next) => {
    res.send('Test Route OK');
});
router.post('/', async (req, res, next) => {
    try {
        await clientController.create(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/email', async (req, res, next) => {
    try {
        await clientController.findByEmail(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/', async (req, res, next) => {
    try {
        await clientController.findAll(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        await clientController.findById(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        await clientController.update(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', async (req, res, next) => {
    try {
        await clientController.delete(req, res);
    }
    catch (error) {
        next(error);
    }
});
export default router;
