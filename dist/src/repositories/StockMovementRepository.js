"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockMovementRepository = void 0;
const StockMovement_1 = require("../database/entities/StockMovement"); // Ajuste o caminho
const database_1 = __importDefault(require("../database")); // Ajuste o caminho
exports.StockMovementRepository = database_1.default.getRepository(StockMovement_1.StockMovement);
// Exemplo de um método customizado (para adicionar no futuro, se necessário)
/*
export const StockMovementRepositoryWithCustomMethods = StockMovementRepository.extend({
    findMovementsForProduct(productId: string) {
        return this.find({ where: { product_id: productId }, relations: ['product'] });
    }
});
*/ 
