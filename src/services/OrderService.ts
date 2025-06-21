// src/services/OrderService.ts
import { AppDataSource } from '../database';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Order } from '../database/entities/Order';
import { OrderItem } from '../database/entities/OrderItem'; 
import { StockMovement } from '../database/entities/StockMovement';
import { Product } from '../database/entities/Product';
import { Client } from '../database/entities/Client';
import { CreateOrderDTO } from '../dtos/orders/CreateOrderDTO'; 
import { CreateOrderItemDTO } from '../dtos/orders/CreateOrderItemDTO'; 
import { UpdateOrderDTO } from '../dtos/orders/UpdateOrderDTO';

import { Repository } from 'typeorm';

export class OrderService {
    private orderRepository: Repository<Order>
    private orderItemtRepository: Repository<OrderItem>;
    private stockMovementRepository: Repository<StockMovement>;
    private productRepository: Repository<Product>;
    private clientRepository: Repository<Client>;

    async create(orderData: CreateOrderDTO): Promise<Order> {
        const orderDto = plainToInstance(CreateOrderDTO, orderData);
        const errors = await validate(orderDto);

        if (errors.length > 0) {
            const errorMessages = errors.map(err => Object.values(err.constraints || {})).flat();
            throw new Error(`Dados do pedido inválidos: ${errorMessages.join(', ')}`);
        }

        // Inicia uma transação no banco de dados
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 2. Lógica de Negócio: Verificar cliente e produtos
            const client = await queryRunner.manager.findOneBy(Client, { id: orderInstance.clientId });
            if (!client) {
                throw new Error(`Cliente com ID ${orderInstance.clientId} não encontrado.`);
            }

            const productIds = orderInstance.items.map(item => item.productId);
            const products = await queryRunner.manager.findBy(Product, { id: In(productIds) });

            if (products.length !== productIds.length) {
                 // Identificar qual produto não foi encontrado para uma mensagem mais específica
                 const foundProductIds = products.map(p => p.id);
                 const notFoundIds = productIds.filter(id => !foundProductIds.includes(id));
                 throw new Error(`Produto(s) com IDs ${notFoundIds.join(', ')} não encontrado(s).`);
            }

            // Mapear produtos por ID para fácil acesso
            const productMap = new Map(products.map(p => [p.id, p]));

            // 3. Lógica de Negócio: Verificar estoque e preparar OrderItems e StockMovements
            const orderItemsToCreate: OrderItem[] = [];
            const stockMovementsToCreate: StockMovement[] = [];
            let totalAmount = 0;

            for (const item of orderInstance.items) {
                const product = productMap.get(item.productId);
                if (!product) {
                    // Esta verificação já foi feita, mas mantida por segurança
                     throw new Error(`Produto com ID ${item.productId} não encontrado (verificação interna).`);
                }

                // Validar o item individualmente (opcional, se DTO do item tiver validações)
                const orderItemInstance = plainToInstance(CreateOrderItemDTO, item);
                 const itemErrors = await validate(orderItemInstance);
                 if (itemErrors.length > 0) {
                    console.error('Order Item validation failed: ', itemErrors);
                    throw new Error(`Dados do item do pedido inválidos para o produto ${product.name}.`);
                 }


                // Verificar estoque disponível (sumarizar movimentos de entrada - saída)
                // Esta é uma lógica simplificada. Uma abordagem robusta envolveria calcular o saldo atual.
                // Para este exemplo, vamos assumir um campo 'stock' no Product ou uma consulta agregada.
                // Exemplo Simplificado: Assumindo que Product tem um campo 'stockQuantity'
                // Em um sistema real, você consultaria a tabela StockMovement para o saldo atual.
                const currentStock = product.stock; // Assumindo campo `stockQuantity` em Product
                if (currentStock < item.quantity) {
                    throw new Error(`Estoque insuficiente para o produto "${product.name}". Disponível: ${currentStock}, Requisitado: ${item.quantity}.`);
                }

                // Preparar OrderItem
                const orderItem = queryRunner.manager.create(OrderItem, {
                    product: product,
                    quantity: item.quantity,
                    price: product.price, // Usar o preço atual do produto ou um snapshot do preço? Decisão de negócio.
                    // order será setado após a criação do pedido pai
                });
                orderItemsToCreate.push(orderItem);
                totalAmount += orderItem.unitPrice * orderItem.quantity;

                // Preparar StockMovement (Saída)
                const stockMovement = queryRunner.manager.create(StockMovement, {
                    product: product,
                    quantity: -item.quantity, // Quantidade negativa para saída
                    movementType: 'Saída (Pedido)', // Tipo de movimento
                    // orderItem será setado após a criação do OrderItem
                });
                stockMovementsToCreate.push(stockMovement);

                // Atualizar estoque do produto (exemplo simplificado)
                product.stock -= item.quantity; // Atualizar no objeto para salvar depois
            }

            // 4. Criar o Pedido
            const order = queryRunner.manager.create(Order, {
                client: client,
                totalAmount: totalAmount,
                status: 'Pendente', // Status inicial
                // items serão associados após a criação do pedido
            });

            const savedOrder = await queryRunner.manager.save(order);

            // 5. Associar OrderItems e StockMovements ao Pedido e Itens criados
            for (const orderItem of orderItemsToCreate) {
                orderItem.order = savedOrder;
                 const savedOrderItem = await queryRunner.manager.save(orderItem); // Salvar item para obter ID

                // Encontrar o movimento de estoque correspondente e associar ao item de pedido salvo
                const stockMovement = stockMovementsToCreate.find(sm => sm.product.id === orderItem.product.id && sm.quantity === -orderItem.quantity);
                 if (stockMovement) {
                     stockMovement.orderItem = savedOrderItem;
                     await queryRunner.manager.save(stockMovement); // Salvar movimento com associação
                 }
            }

            // 6. Atualizar os produtos com os novos saldos de estoque (exemplo simplificado)
            await queryRunner.manager.save(products);


            // 7. Commit da transação
            await queryRunner.commitTransaction();

            return savedOrder;

        } catch (error) {
            // Rollback em caso de qualquer erro
            await queryRunner.rollbackTransaction();
            console.error('Erro ao criar pedido:', error);
            throw error; // Lançar o erro novamente para ser tratado na camada superior
        } finally {
            // Liberar o query runner
            await queryRunner.release();
        }
    }

    /**
     * Busca um pedido pelo ID, incluindo os itens.
     * @param id ID do pedido (UUID).
     * @returns O pedido encontrado (com itens) ou null.
     */
    async findById(id: string): Promise<Order | null> {
        return await orderRepository.findOne({
            where: { id },
            relations: ['items', 'items.product', 'client'] // Inclui itens, produtos dos itens e o cliente
        });
    }

    /**
     * Lista todos os pedidos (ou filtrados por cliente, status, etc. - lógica adicional).
     * @returns Array de pedidos.
     */
    async findAll(): Promise<Order[]> {
        return await orderRepository.find({ relations: ['client'] }); // Exemplo: inclui apenas o cliente
    }

     /**
      * Busca pedidos por ID de cliente.
      * @param clientId ID do cliente.
      * @returns Array de pedidos do cliente.
      */
     async findByClientId(clientId: string): Promise<Order[]> {
        return await orderRepository.find({
            where: { client: { id: clientId } }, // Filtra pelo ID do cliente associado
            relations: ['items', 'items.product']
        });
     }


    /**
     * Atualiza o status de um pedido existente (exemplo simples).
     * @param id ID do pedido a ser atualizado.
     * @param updateData Dados para atualização (ex: { status: 'Enviado' }).
     * @returns O pedido atualizado ou null se não encontrado.
     * @throws Error se a validação falhar ou se o pedido não existir.
     */
    async updateStatus(id: string, updateData: UpdateOrderDTO): Promise<Order | null> {
        // 1. Validar se o pedido existe
         const orderToUpdate = await orderRepository.findOneBy({ id });
         if (!orderToUpdate) {
             return null; // Ou lançar erro "Pedido não encontrado"
         }

         // 2. Validação usando class-validator/transformer (apenas para campos permitidos na atualização)
        const updateInstance = plainToInstance(UpdateOrderDTO, updateData);
        const errors = await validate(updateInstance);

        if (errors.length > 0) {
            console.error('Validation failed: ', errors);
            throw new Error('Dados de atualização do pedido inválidos.');
        }

        // 3. Aplicar atualizações (ex: apenas o status) e salvar
        if (updateInstance.status !== undefined) {
            // Implementar lógica de transição de status se necessário
            orderToUpdate.status = updateInstance.status;
        }
        // Não permitir atualizar itens do pedido ou total por aqui.

        return await orderRepository.save(orderToUpdate);
    }

    /**
     * Remove um pedido pelo ID (geralmente não permitido em e-commerce real após certo status).
     * @param id ID do pedido a ser removido.
     * @returns True se removido com sucesso, false se não encontrado.
     * @throws Error se o pedido estiver em um status que impede remoção.
     */
    async delete(id: string): Promise<boolean> {
        // Lógica de negócio: Impedir exclusão se o pedido não estiver em status 'Pendente' ou similar.
        const order = await orderRepository.findOneBy({ id });
        if (!order) {
            return false; // Pedido não encontrado
        }
        if (order.status !== 'Pendente') { // Exemplo de regra
            throw new Error(`Não é possível excluir um pedido com status "${order.status}".`);
        }

        // Em um cenário mais complexo, a exclusão do pedido exigiria:
        // 1. Excluir OrderItems associados.
        // 2. Reverter StockMovements associados (ou criar novos movimentos de entrada).
        // 3. Atualizar saldos de estoque dos produtos.
        // Tudo isso dentro de uma transação.

        // Exemplo simplificado que pode falhar dependendo das restrições FK e lógica de negócio
        const result = await orderRepository.delete(id);
        //return result.affected !== undefined && result.affected > 0;
        return !!result.affected && result.affected > 0;
    }
}

// Exportar uma instância padrão
export const orderService = new OrderService();
