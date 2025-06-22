import { IsUUID, IsNumber, IsEnum, IsNotEmpty, ArrayMinSize, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum OrderStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELED = 'canceled',
}

class OrderItemDTO {
    @IsUUID()
    productId!: string;

    @IsNumber()
    @Min(1)
    quantity!: number;
}

export class CreateOrderDTO {
    @IsUUID('4', { message: 'O ID do cliente deve ser um UUID válido.' })
    @IsNotEmpty({ message: 'O ID do cliente não pode ser vazio.' })
    clientId!: string;

    @IsEnum(OrderStatus, { message: 'O status do pedido deve ser um dos valores permitidos.' })
    @IsNotEmpty({ message: 'O status do pedido não pode ser vazio.' })
    status!: OrderStatus;

    @ArrayMinSize(1, { message: 'O pedido deve conter pelo menos um item.' })
    @ValidateNested({ each: true }) 
    @Type(() => OrderItemDTO) 
    items!: OrderItemDTO[];
}
