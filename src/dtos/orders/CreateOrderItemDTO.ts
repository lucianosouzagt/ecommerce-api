// src/dtos/orders/CreateOrderItemDTO.ts
import { IsUUID, IsInt, IsNumber, Min } from 'class-validator';

export class CreateOrderItemDTO {
    @IsUUID()
    productId!: string;

    @IsInt()
    @Min(1)
    quantity!: number;

}