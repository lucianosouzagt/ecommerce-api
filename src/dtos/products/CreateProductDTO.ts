// src/dtos/products/CreateProductDTO.ts
import { IsString, Length, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateProductDTO {
    @IsString()
    @Length(3, 255)
    name!: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(0) // Preço não pode ser negativo
    price!: number;

    // stockQuantity não vem no DTO de criação, é gerenciado via StockMovement
    // Mas para um exemplo básico, poderíamos permitir um stock inicial
    // @IsInt()
    // @Min(0)
    // initialStock: number;
}