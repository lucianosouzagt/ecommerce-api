// src/dtos/orders/CreateOrderDTO.ts
import { IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer'; // Necessário para @Type
import { CreateOrderItemDTO } from './CreateOrderItemDTO';

export class CreateOrderDTO {
    @IsUUID()
    clientId!: string;

    @IsArray()
    @ValidateNested({ each: true }) // Valida cada item no array
    @Type(() => CreateOrderItemDTO) // Transforma os objetos do array em instâncias de CreateOrderItemDTO
    items!: CreateOrderItemDTO[];

    // Nota: totalAmount e status são calculados/definidos no serviço,
    // não devem vir no DTO de criação.
}