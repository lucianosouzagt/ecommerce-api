// src/database/repositories/ProductRepository.ts
import { Repository } from 'typeorm';
import { Product } from '../database/entities/Product'; // Ajuste o caminho
import AppDataSource from '../database'; // Ajuste o caminho

export const ProductRepository: Repository<Product> = AppDataSource.getRepository(Product);

// Exemplo de um método customizado para buscar produtos ativos

export const ProductRepositoryWithCustomMethods = ProductRepository.extend({
    findActiveProducts() {
        return this.find({ where: { is_active: true } });
    }
});
