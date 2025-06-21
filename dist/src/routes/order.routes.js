"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/order.routes.ts
const express_1 = require("express"); // Importar NextFunction
const OrderController_1 = require("../controllers/OrderController");
const router = (0, express_1.Router)();
const orderController = new OrderController_1.OrderController();
// Handler de teste simples
router.get('/test', (req, res, next) => {
    res.send('Test Route OK');
});
router.post('/', async (req, res, next) => {
    try {
        await orderController.create(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/', async (req, res, next) => {
    try {
        await orderController.findAll(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        await orderController.findById(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        await orderController.updateStatus(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', async (req, res, next) => {
    try {
        await orderController.delete(req, res);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
