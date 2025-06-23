import { Router } from 'express';
import { ProductController } from '../controllers/ProductController.js';
const router = Router();
const productController = new ProductController();
router.get('/test', (req, res) => {
    res.send('Rota de produtos OK');
});
router.post('/', async (req, res, next) => {
    try {
        await productController.create(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/', async (req, res, next) => {
    try {
        await productController.findAll(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/name', async (req, res, next) => {
    try {
        await productController.findByName(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/count', async (req, res, next) => {
    try {
        await productController.count(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        await productController.findById(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        await productController.update(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', async (req, res, next) => {
    try {
        await productController.delete(req, res);
    }
    catch (error) {
        next(error);
    }
});
export default router;
