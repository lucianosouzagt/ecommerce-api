import { AppDataSource } from '../database/index.js';
import { StockMovement } from '../database/entities/StockMovement.js';
export const StockMovementRepository = AppDataSource.getRepository(StockMovement);
// Exemplo de um método customizado (para adicionar no futuro, se necessário)
/*
export const StockMovementRepositoryWithCustomMethods = StockMovementRepository.extend({
    findMovementsForProduct(productId: string) {
        return this.find({ where: { product_id: productId }, relations: ['product'] });
    }
});
*/ 
