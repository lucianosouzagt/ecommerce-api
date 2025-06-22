"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = exports.ProductService = void 0;
const database_1 = require("../database");
const Product_1 = require("../database/entities/Product");
const CreateProductDTO_1 = require("../dtos/products/CreateProductDTO");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ProductService {
    constructor(productRepository) {
        this.productRepository = productRepository || database_1.AppDataSource.getRepository(Product_1.Product);
    }
    async create(productData) {
        const dto = (0, class_transformer_1.plainToInstance)(CreateProductDTO_1.CreateProductDTO, productData);
        const errors = await (0, class_validator_1.validate)(dto);
        if (errors.length > 0) {
            const messages = errors.map(err => Object.values(err.constraints || {})).flat();
            throw new Error(`Dados do produto inválidos: ${messages.join(', ')}`);
        }
        const product = this.productRepository.create(productData);
        return await this.productRepository.save(product);
    }
    async findById(id) {
        return this.productRepository.findOneBy({ id });
    }
    async findAll() {
        return this.productRepository.find();
    }
    async update(id, productData) {
        const product = await this.productRepository.findOneBy({ id });
        if (!product)
            return null;
        this.productRepository.merge(product, productData);
        return await this.productRepository.save(product);
    }
    async delete(id) {
        const result = await this.productRepository.delete(id);
        return !!result.affected && result.affected > 0;
    }
}
exports.ProductService = ProductService;
exports.productService = new ProductService();
