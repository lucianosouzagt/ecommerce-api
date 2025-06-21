"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/client.routes.ts
const express_1 = require("express"); // Importar NextFunction
const ClientController_1 = require("../controllers/ClientController");
const router = (0, express_1.Router)();
const clientController = new ClientController_1.ClientController();
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
exports.default = router;
