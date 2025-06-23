import { AppDataSource } from '../database/index.js';
import { Repository } from 'typeorm';
import { Product } from '../database/entities/Product.js';
import { CreateProductDTO } from '../dtos/products/CreateProductDTO.js';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class ProductService {
    private productRepository: Repository<Product>;

    constructor(productRepository?: Repository<Product>) {
        this.productRepository = productRepository || AppDataSource.getRepository(Product);
    }

    async create(productData: CreateProductDTO): Promise<Product> {
        const dto = plainToInstance(CreateProductDTO, productData);
        const errors = await validate(dto);
        if (errors.length > 0) {
            const messages = errors.map(err => Object.values(err.constraints || {})).flat();
            throw new Error(`Dados do produto inválidos: ${messages.join(', ')}`);
        }

        const product = this.productRepository.create(productData);
        return await this.productRepository.save(product);
    }

    async findById(id: string): Promise<Product | null> {
        return this.productRepository.findOneBy({ id });
    }

    async findByName(name: string): Promise<Product | null> {
        return this.productRepository.findOneBy({ name });
    }

    async findAll(): Promise<Product[]> {
        return this.productRepository.find();
    }

    async count(): Promise<number | null> {
        return this.productRepository.count();
    }

    async update(id: string, productData: Partial<CreateProductDTO>): Promise<Product | null> {
        const product = await this.productRepository.findOneBy({ id });
        if (!product) return null;

        this.productRepository.merge(product, productData);
        return await this.productRepository.save(product);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.productRepository.delete(id);
        return !!result.affected && result.affected > 0;
    }
}

export const productService = new ProductService();
