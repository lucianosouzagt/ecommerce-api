"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const StockMovementController_1 = require("../controllers/StockMovementController");
const router = (0, express_1.Router)();
const stockMovementController = new StockMovementController_1.StockMovementController();
router.get('/test', (req, res) => {
    res.send('Rota de movimentações de estoque OK');
});
router.post('/', async (req, res, next) => {
    try {
        await stockMovementController.create(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/', async (req, res, next) => {
    try {
        await stockMovementController.findAll(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/product/:id', async (req, res, next) => {
    try {
        await stockMovementController.findByProduct(req, res);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
