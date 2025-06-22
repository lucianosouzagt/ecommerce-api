import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateProductDTO {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsString()
    description!: string;

    @IsNumber()
    @Min(0)
    price!: number;

    @IsNumber()
    @Min(0)
    stock!: number;
}
