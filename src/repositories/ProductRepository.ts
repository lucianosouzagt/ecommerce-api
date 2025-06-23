// src/database/repositories/ProductRepository.ts
import { Repository } from 'typeorm';
import { AppDataSource } from '../database/index.js';
import { Product } from '../database/entities/Product.js';

export class ProductRepository {
    private repo: Repository<Product>;

    constructor() {
        this.repo = AppDataSource.getRepository(Product);
    }

    async findById(id: string): Promise<Product | null> {
        return this.repo.findOneBy({ id });
    }

    async findByName(name: string): Promise<Product | null> {
        return this.repo.findOneBy({ name });
    }

    async findAll(): Promise<Product[]> {
        return this.repo.find();
    }

    async count(): Promise<number> {
        return this.repo.count();
    }

    async createAndSave(productData: Partial<Product>): Promise<Product> {
        const product = this.repo.create(productData);
        return this.repo.save(product);
    }

    async update(id: string, productData: Partial<Product>): Promise<Product | null> {
        const product = await this.repo.findOneBy({ id });
        if (!product) return null;
        this.repo.merge(product, productData);
        return this.repo.save(product);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repo.delete(id);
        return !!result.affected && result.affected > 0;
    }
}
