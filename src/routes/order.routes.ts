// src/routes/order.routes.ts
import { Router, Request, Response, NextFunction } from 'express'; // Importar NextFunction
import { OrderController } from '../controllers/OrderController';

const router = Router();
const orderController = new OrderController();

// Handler de teste simples
router.get('/test', (req: Request, res: Response, next: NextFunction) => {
    res.send('Test Route OK');
});

router.post('/', async (req, res, next) => {
  try {
      await orderController.create(req, res)
  } catch(error) {
      next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
      await orderController.findAll(req, res)
  } catch(error) {
      next(error);
  }
});
router.get('/:id', async (req, res, next) => {
  try {
      await orderController.findById(req, res)
  } catch(error) {
      next(error);
  }
});
router.put('/:id',async (req, res, next) => {
  try {
      await orderController.updateStatus(req, res)
  } catch(error) {
    next(error);
  }
});
router.delete('/:id', async (req, res, next) => {
  try {
      await orderController.delete(req, res)
  } catch(error) {
    next(error);
  }
});


export default router;