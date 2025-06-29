// src/database/repositories/StockMovementRepository.ts
import { Repository } from 'typeorm';
import { AppDataSource } from '../database/index.js'; 
import { StockMovement } from '../database/entities/StockMovement.js'; 

// Definir a interface para os métodos customizados
interface ProductRepositoryCustom extends Repository<StockMovement> {
    findActiveProducts(): Promise<StockMovement[]>;
    // Adicione outras declarações de método aqui
}

export const StockMovementRepository: Repository<StockMovement> = AppDataSource.getRepository(StockMovement);

// Exemplo de um método customizado (para adicionar no futuro, se necessário)
/*
export const StockMovementRepositoryWithCustomMethods = StockMovementRepository.extend({
    findMovementsForProduct(productId: string) {
        return this.find({ where: { product_id: productId }, relations: ['product'] });
    }
});
*/