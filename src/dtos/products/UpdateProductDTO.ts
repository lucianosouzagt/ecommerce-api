// src/dtos/products/UpdateProductDTO.ts
import { IsString, Length, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateProductDTO {
    @IsString()
    @Length(3, 255)
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(0)
    @IsOptional() // Preço opcional na atualização
    price?: number;

    // stockQuantity não é atualizado diretamente aqui, apenas via StockMovement
}