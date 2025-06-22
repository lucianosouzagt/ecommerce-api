// src/dtos/orders/CreateOrderItemDTO.ts
import { IsUUID, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateOrderItemDTO {
  @IsUUID('4', { message: 'O ID do produto deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'O ID do produto não pode ser vazio.' })
  productId!: string;

  @IsNumber({}, { message: 'A quantidade deve ser um número.' })
  @IsPositive({ message: 'A quantidade deve ser um número positivo.' })
  @IsNotEmpty({ message: 'A quantidade não pode ser vazia.' })
  quantity!: number;

}