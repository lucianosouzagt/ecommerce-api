import { AppDataSource } from '../database';
import { Repository } from 'typeorm';
import { Order } from '../database/entities/Order';
import { CreateOrderDTO } from '../dtos/orders/CreateOrderDTO';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Client } from '../database/entities/Client';
import { Product } from '../database/entities/Product';
import { OrderItem } from '../database/entities/OrderItem';

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
            const messages = errors.map(err => Object.values(err.constraints || {})).flat();
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

        // Neste exemplo não atualizamos itens nem cliente — só status
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
