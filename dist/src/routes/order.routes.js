"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrderController_1 = require("../controllers/OrderController");
const router = (0, express_1.Router)();
const orderController = new OrderController_1.OrderController();
router.get('/test', (req, res) => {
    res.send('Rota de pedidos OK');
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
        await orderController.update(req, res);
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
