"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockMovementService = exports.StockMovementService = void 0;
const database_1 = require("../database");
const StockMovement_1 = require("../database/entities/StockMovement");
const CreateStockMovementDTO_1 = require("../dtos/stockMovements/CreateStockMovementDTO");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const Product_1 = require("../database/entities/Product");
class StockMovementService {
    constructor(stockMovementRepository) {
        this.stockMovementRepository = stockMovementRepository || database_1.AppDataSource.getRepository(StockMovement_1.StockMovement);
    }
    async create(data) {
        const dto = (0, class_transformer_1.plainToInstance)(CreateStockMovementDTO_1.CreateStockMovementDTO, data);
        const errors = await (0, class_validator_1.validate)(dto);
        if (errors.length > 0) {
            const messages = errors.map(err => Object.values(err.constraints || {})).flat();
            throw new Error(`Dados inválidos: ${messages.join(', ')}`);
        }
        const productRepo = database_1.AppDataSource.getRepository(Product_1.Product);
        const product = await productRepo.findOneBy({ id: data.productId });
        if (!product)
            throw new Error('Produto não encontrado.');
        const movement = this.stockMovementRepository.create({
            ...data,
            product,
        });
        // Aqui você poderia atualizar o estoque do produto, se quiser centralizar
        product.stock += data.quantity;
        await productRepo.save(product);
        return await this.stockMovementRepository.save(movement);
    }
    async findAll() {
        return this.stockMovementRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findByProduct(productId) {
        return this.stockMovementRepository.find({
            where: { product: { id: productId } },
            order: { createdAt: 'DESC' },
        });
    }
}
exports.StockMovementService = StockMovementService;
exports.stockMovementService = new StockMovementService();
