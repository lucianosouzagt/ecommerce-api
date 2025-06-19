"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/produto.routes.ts
const express_1 = require("express"); // Importar NextFunction
const product_controller_1 = require("../controllers/product.controller");
const router = (0, express_1.Router)();
const productController = new product_controller_1.ProductController();
// Handler de teste simples
router.get('/test', (req, res, next) => {
    res.send('Test Route OK');
});
router.get('/', productController.listarTodosProdutos);
router.get('/:id', productController.buscarProdutoPorId); // <-- Linha com erro
exports.default = router;
