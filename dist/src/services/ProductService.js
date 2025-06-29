import { AppDataSource } from '../database/index.js';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Product } from '../database/entities/Product.js';
import { CreateProductDTO } from '../dtos/products/CreateProductDTO.js';
export class ProductService {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository || AppDataSource.getRepository(Product);
    }
    async create(productData) {
        const dto = plainToInstance(CreateProductDTO, productData);
        const errors = await validate(dto);
        if (errors.length > 0) {
            const messages = errors.map(err => Object.values(err.constraints || {})).flat();
            throw new Error(`Dados do produto inválidos: ${messages.join(', ')}`);
        }
        const product = this.productRepository.create(productData);
        const savedProduct = await this.productRepository.save(product);
        return savedProduct;
    }
    async findById(id) {
        return this.productRepository.findOneBy({ id });
    }
    async findByName(name) {
        return this.productRepository.findOneBy({ name });
    }
    async findAll() {
        return this.productRepository.find();
    }
    async count() {
        return this.productRepository.count();
    }
    async update(id, productData) {
        const product = await this.productRepository.findOneBy({ id });
        if (!product)
            return null;
        this.productRepository.merge(product, productData);
        const updateProduct = await this.productRepository.save(product);
        return updateProduct;
    }
    async delete(id) {
        const result = await this.productRepository.delete(id);
        return !!result.affected && result.affected > 0;
    }
}
export const productService = new ProductService();
