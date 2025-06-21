"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/client.routes.ts
const express_1 = require("express"); // Importar NextFunction
const UserController_1 = require("../controllers/UserController");
const router = (0, express_1.Router)();
const userController = new UserController_1.UserController();
// Handler de teste simples
router.get('/test', (req, res, next) => {
    res.send('Test Route OK');
});
router.post('/', async (req, res, next) => {
    try {
        await userController.create(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/', async (req, res, next) => {
    try {
        await userController.findAll(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        await userController.findById(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id', async (req, res, next) => {
    try {
        await userController.update(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', async (req, res, next) => {
    try {
        await userController.delete(req, res);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
