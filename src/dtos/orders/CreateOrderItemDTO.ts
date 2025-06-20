// src/dtos/orders/CreateOrderItemDTO.ts
import { IsUUID, IsInt, IsNumber, Min } from 'class-validator';

export class CreateOrderItemDTO {
    @IsUUID()
    productId!: string;

    @IsInt()
    @Min(1)
    quantity!: number;

    // Nota: price geralmente não vem no DTO de criação do item,
    // pois o serviço deve buscar o preço atual do produto.
    // Se precisar de um snapshot de preço, pode adicionar aqui,
    // mas validando que faz sentido (ex: não pode ser zero ou negativo).
}