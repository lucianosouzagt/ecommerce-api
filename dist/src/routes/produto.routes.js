"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/produto.routes.ts
const express_1 = require("express");
const ProductController_1 = require("../controllers/ProductController");
const router = (0, express_1.Router)();
const productController = new ProductController_1.ProductController();
// Handler de teste simples (síncrono)
router.get('/test', (req, res, next) => {
    res.send('Test Route OK');
});
// Definir handlers usando lambda async e try...catch
// O tipo inferido para essas lambdas async que não retornam explicitamente nada
// é Promise<void>, o que é compatível com RequestHandler.
router.post('/', async (req, res, next) => {
    try {
        await productController.create(req, res); // Assumimos que create envia a resposta (res.status().json())
    }
    catch (error) {
        next(error); // Passa qualquer erro lançado pelo controller ou service para o próximo middleware de erro
    }
});
router.get('/', async (req, res, next) => {
    try {
        await productController.findAll(req, res); // Assumimos que findAll envia a resposta
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        await productController.findById(req, res); // Assumimos que findById envia a resposta (ou 404)
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        await productController.update(req, res); // Assumimos que update envia a resposta (ou 400/404)
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', async (req, res, next) => {
    try {
        await productController.delete(req, res); // Assumimos que delete envia a resposta (ou 404/409)
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
