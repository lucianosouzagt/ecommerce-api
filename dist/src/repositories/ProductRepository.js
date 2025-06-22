"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const database_1 = require("../database");
const Product_1 = require("../database/entities/Product");
class ProductRepository {
    constructor() {
        this.repo = database_1.AppDataSource.getRepository(Product_1.Product);
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
exports.ProductRepository = ProductRepository;
