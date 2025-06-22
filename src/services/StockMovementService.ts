import { AppDataSource } from '../database/index.js';
import { Repository } from 'typeorm';
import { StockMovement } from '../database/entities/StockMovement.js';
import { CreateStockMovementDTO } from '../dtos/stockMovements/CreateStockMovementDTO.js';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Product } from '../database/entities/Product.js';

export class StockMovementService {
    private stockMovementRepository: Repository<StockMovement>;

    constructor(stockMovementRepository?: Repository<StockMovement>) {
        this.stockMovementRepository = stockMovementRepository || AppDataSource.getRepository(StockMovement);
    }

    async create(data: CreateStockMovementDTO): Promise<StockMovement> {
        const dto = plainToInstance(CreateStockMovementDTO, data);
        const errors = await validate(dto);
        if (errors.length > 0) {
            const messages = errors.map(err => Object.values(err.constraints || {})).flat();
            throw new Error(`Dados inválidos: ${messages.join(', ')}`);
        }

        const productRepo = AppDataSource.getRepository(Product);
        const product = await productRepo.findOneBy({ id: data.productId });
        if (!product) throw new Error('Produto não encontrado.');

        const movement = this.stockMovementRepository.create({
            ...data,
            product,
        });

        // Aqui você poderia atualizar o estoque do produto, se quiser centralizar
        product.stock += data.quantity;
        await productRepo.save(product);

        return await this.stockMovementRepository.save(movement);
    }

    async findAll(): Promise<StockMovement[]> {
        return this.stockMovementRepository.find({
            order: { created_at: 'DESC' },
        });
    }

    async findByProduct(productId: string): Promise<StockMovement[]> {
        return this.stockMovementRepository.find({
            where: { product: { id: productId } },
            order: { created_at: 'DESC' },
        });
    }
}

export const stockMovementService = new StockMovementService();
