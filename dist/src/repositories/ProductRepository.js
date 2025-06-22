import { AppDataSource } from '../database/index.js';
import { Product } from '../database/entities/Product.js';
export class ProductRepository {
    repo;
    constructor() {
        this.repo = AppDataSource.getRepository(Product);
    }
    async findAll() {
        return this.repo.find();
    }
    async findById(id) {
        return this.repo.findOneBy({ id });
    }
    async createAndSave(productData) {
        const product = this.repo.create(productData);
        return this.repo.save(product);
    }
    async update(id, productData) {
        const product = await this.repo.findOneBy({ id });
        if (!product)
            return null;
        this.repo.merge(product, productData);
        return this.repo.save(product);
    }
    async delete(id) {
        const result = await this.repo.delete(id);
        return !!result.affected && result.affected > 0;
    }
}
