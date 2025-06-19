// src/routes/produto.routes.ts
import { Router, Request, Response, NextFunction } from 'express'; // Importar NextFunction
import { ProductController } from '../controllers/product.controller';

const router = Router();
const productController = new ProductController();

// Handler de teste simples
router.get('/test', (req: Request, res: Response, next: NextFunction) => {
    res.send('Test Route OK');
});

router.get('/', productController.listarTodosProdutos);
router.get('/:id', productController.buscarProdutoPorId); // <-- Linha com erro

export default router;