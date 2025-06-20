// src/dtos/stockMovements/CreateStockMovementDTO.ts
import { IsUUID, IsInt, IsNumber, IsString, IsIn, IsOptional } from 'class-validator';

export class CreateStockMovementDTO {
    @IsUUID()
    productId!: string;

    @IsInt() // Quantidade pode ser positiva (entrada) ou negativa (saída)
    @IsNumber() // Usar IsNumber pois quantidade pode ser 0 ou negativa
    quantity!: number;

    @IsString()
    @IsIn(['Entrada', 'Saída (Pedido)', 'Saída (Perda)', 'Entrada (Ajuste)', 'Saída (Ajuste)']) // Tipos de movimento permitidos
    movementType!: string;

     @IsUUID()
     @IsOptional() // Opcional, se o movimento está ligado a um OrderItem
     orderItemId?: string;

     // Adicionar outros campos opcionais como reference (ex: número da nota fiscal)
     @IsString()
     @IsOptional()
     reference?: string;
}