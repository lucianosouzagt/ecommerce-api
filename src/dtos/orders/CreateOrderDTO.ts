import { IsUUID, IsNumber, IsString, IsNotEmpty, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDTO {
    @IsUUID()
    productId!: string;

    @IsNumber()
    @Min(1)
    quantity!: number;
}

export class CreateOrderDTO {
    @IsUUID()
    clientId!: string;

    @IsString()
    @IsNotEmpty()
    status!: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDTO)
    items!: OrderItemDTO[];
}
