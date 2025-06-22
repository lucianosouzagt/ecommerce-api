import { AppDataSource } from '../database/index.js';
import { Repository } from 'typeorm';
import { Order } from '../database/entities/Order.js';
import { CreateOrderDTO } from '../dtos/orders/CreateOrderDTO.js';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Client } from '../database/entities/Client.js';
import { Product } from '../database/entities/Product.js';
import { OrderItem } from '../database/entities/OrderItem.js';

// Função auxiliar para extrair todas as mensagens de erro de validação, incluindo as aninhadas
function getValidationMessages(errors: ValidationError[]): string[] {
    let messages: string[] = [];
    errors.forEach(err => {
        if (err.constraints) {
            messages = messages.concat(Object.values(err.constraints));
        }
        if (err.children && err.children.length > 0) {
            // Recursivamente busca por erros em objetos aninhados
            messages = messages.concat(getValidationMessages(err.children));
        }
    });
    return messages;
}

export class OrderService {
    private orderRepository: Repository<Order>;
    private productRepository: Repository<Product>;

    constructor(orderRepository?: Repository<Order>) {
        this.orderRepository = orderRepository || AppDataSource.getRepository(Order);
        this.productRepository = AppDataSource.getRepository(Product);
    }

    async create(orderData: CreateOrderDTO): Promise<Order> {
        const dto = plainToInstance(CreateOrderDTO, orderData);
        const errors = await validate(dto);

        if (errors.length > 0) {
            const messages = getValidationMessages(errors); // Usa a função auxiliar
            throw new Error(`Dados do pedido inválidos: ${messages.join(', ')}`);
        }

        const clientRepo = AppDataSource.getRepository(Client);
        const client = await clientRepo.findOneBy({ id: orderData.clientId });
        if (!client) throw new Error('Cliente não encontrado.');

        const items: OrderItem[] = [];
        let total = 0;

        for (const itemData of orderData.items) {
            const product = await this.productRepository.findOneBy({ id: itemData.productId });
            if (!product) throw new Error(`Produto ${itemData.productId} não encontrado.`);

            if (product.stock < itemData.quantity) {
                throw new Error(`Estoque insuficiente para o produto: ${product.name}`);
            }

            const unitPrice = parseFloat(product.price.toString());
            const totalPrice = unitPrice * itemData.quantity;

            // Atualiza estoque
            product.stock -= itemData.quantity;
            await this.productRepository.save(product);

            const orderItem = new OrderItem();
            orderItem.product = product;
            orderItem.quantity = itemData.quantity;
            orderItem.unitPrice = unitPrice;
            orderItem.totalPrice = totalPrice;

            items.push(orderItem);
            total += totalPrice;
        }

        const order = this.orderRepository.create({
            client,
            status: orderData.status,
            total,
            items,
        });

        return await this.orderRepository.save(order);
    }

    async findById(id: string): Promise<Order | null> {
        return this.orderRepository.findOneBy({ id });
    }

    async findAll(): Promise<Order[]> {
        return this.orderRepository.find();
    }

    async update(id: string, data: Partial<CreateOrderDTO>): Promise<Order | null> {
        const order = await this.orderRepository.findOneBy({ id });
        if (!order) return null;

        this.orderRepository.merge(order, {
            status: data.status ?? order.status,
        });

        return await this.orderRepository.save(order);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.orderRepository.delete(id);
        return !!result.affected && result.affected > 0;
    }
}

export const orderService = new OrderService();
2