// src/services/produto.service.ts
import AppDataSource from '../database';
import { Product } from '../database/entities/Product';
import { Repository } from 'typeorm';

export class ProductService {
    private productRepository: Repository<Product>;

    constructor() {
        this.productRepository = AppDataSource.getRepository(Product);
    }

    async findAll(): Promise<Product[]> {
        return this.productRepository.find();
    }

    async findById(id: string): Promise<Product | null> {
         return this.productRepository.findOneBy({ id });
    }

    // Implementar outros métodos (findByName, create, update, delete, count)
}