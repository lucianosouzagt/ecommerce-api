import { IsUUID, IsInt, IsIn, IsOptional, IsString } from 'class-validator';

export class CreateStockMovementDTO {
    @IsUUID()
    productId!: string;

    @IsInt()
    quantity!: number;

    @IsIn(['entrada', 'saida', 'ajuste'])
    type!: 'entrada' | 'saida' | 'ajuste';

    @IsOptional()
    @IsString()
    description?: string;
}
