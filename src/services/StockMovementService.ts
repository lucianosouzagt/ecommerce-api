// src/services/StockMovementService.ts
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { StockMovement } from '../database/entities/StockMovement';
import { Product } from '../database/entities/Product'; // Para atualizar saldo no produto
import AppDataSource from '../database';
import { DataSource } from 'typeorm'; // Para transações

// DTOs
import { CreateStockMovementDTO } from '../dtos/stockMovements/CreateStockMovementDTO';

const stockMovementRepository = AppDataSource.getRepository(StockMovement);
const productRepository = AppDataSource.getRepository(Product);

export class StockMovementService {

     /**
      * Cria um novo movimento de estoque e atualiza o saldo do produto.
      * @param movementData Dados do movimento de estoque.
      * @returns O movimento de estoque criado.
      * @throws Error se a validação falhar ou o produto não existir.
      */
    async create(movementData: CreateStockMovementDTO): Promise<StockMovement> {
         // 1. Validação usando class-validator/transformer
         const movementInstance = plainToInstance(CreateStockMovementDTO, movementData);
         const errors = await validate(movementInstance);

         if (errors.length > 0) {
             console.error('Validation failed: ', errors);
             throw new Error('Dados do movimento de estoque inválidos.');
         }

         // Inicia uma transação no banco de dados
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 2. Lógica de Negócio: Verificar produto
            const product = await queryRunner.manager.findOneBy(Product, { id: movementInstance.productId });
            if (!product) {
                throw new Error(`Produto com ID ${movementInstance.productId} não encontrado.`);
            }

            // 3. Criar o movimento de estoque
            const stockMovement = queryRunner.manager.create(StockMovement, {
                ...movementInstance, // Copia os dados validados
                product: product, // Associa a entidade Product encontrada
                 // Campos como orderItem podem ser associados aqui se vierem no DTO e forem validados
            });

             const savedMovement = await queryRunner.manager.save(stockMovement);

            // 4. Lógica de Negócio: Atualizar saldo no Produto (Exemplo: Assumindo campo stockQuantity)
             product.stock += movementInstance.quantity; // Adiciona a quantidade (negativa para saídas)
             await queryRunner.manager.save(product);

             // 5. Commit da transação
             await queryRunner.commitTransaction();

             return savedMovement;

        } catch (error) {
             // Rollback em caso de qualquer erro
            await queryRunner.rollbackTransaction();
            console.error('Erro ao criar movimento de estoque:', error);
            throw error; // Lançar o erro novamente
        } finally {
             // Liberar o query runner
             await queryRunner.release();
        }
    }

    /**
     * Busca um movimento de estoque pelo ID.
     * @param id ID do movimento (UUID).
     * @returns O movimento encontrado ou null.
     */
    async findById(id: string): Promise<StockMovement | null> {
        return await stockMovementRepository.findOne({
            where: { id },
            relations: ['product', 'orderItem'] // Inclui o produto e item de pedido (se associado)
        });
    }

    /**
     * Lista todos os movimentos de estoque (ou filtrados por produto, tipo, etc.).
     * @returns Array de movimentos de estoque.
     */
    async findAll(): Promise<StockMovement[]> {
        return await stockMovementRepository.find({ relations: ['product'] });
    }

     /**
      * Lista movimentos de estoque para um produto específico.
      * @param productId ID do produto.
      * @returns Array de movimentos de estoque do produto.
      */
     async findByProductId(productId: string): Promise<StockMovement[]> {
        return await stockMovementRepository.find({
            where: { product: { id: productId } },
            order: { movementDate: 'ASC' } // Ordenar por data para histórico
        });
     }

     /**
      * Calcula o saldo atual de estoque para um produto (abordagem alternativa se não usar campo em Product).
      * Esta é uma lógica mais intensiva em query para cada consulta.
      * @param productId ID do produto.
      * @returns Saldo atual de estoque.
      */
     async calculateStockBalance(productId: string): Promise<number> {
         const result = await stockMovementRepository
             .createQueryBuilder('movement')
             .select('SUM(movement.quantity)', 'balance')
             .where('movement.productId = :productId', { productId })
             .getRawOne(); // getRawOne retorna um objeto simples com o resultado da agregação

         return result ? Number(result.balance) || 0 : 0; // Retorna o saldo ou 0 se não houver movimentos
     }

    // Métodos update e delete geralmente não são permitidos para StockMovement.
}

// Exportar uma instância padrão
export const stockMovementService = new StockMovementService();