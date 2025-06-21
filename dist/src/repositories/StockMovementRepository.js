"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockMovementRepository = void 0;
const StockMovement_1 = require("../database/entities/StockMovement"); // Ajuste o caminho
const database_1 = require("../database"); // Ajuste o caminho
exports.StockMovementRepository = database_1.AppDataSource.getRepository(StockMovement_1.StockMovement);
// Exemplo de um método customizado (para adicionar no futuro, se necessário)
/*
export const StockMovementRepositoryWithCustomMethods = StockMovementRepository.extend({
    findMovementsForProduct(productId: string) {
        return this.find({ where: { product_id: productId }, relations: ['product'] });
    }
});
*/ 
