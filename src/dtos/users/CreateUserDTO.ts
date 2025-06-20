// src/dtos/users/CreateUserDTO.ts
import { IsString, IsEmail, Length, IsOptional, IsIn } from 'class-validator';

export class CreateUserDTO {
    @IsString()
    @Length(3, 100)
    name!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @Length(6, 50) // Definir um tamanho mínimo e máximo para a senha
    password!: string;

    @IsString()
    @IsOptional()
    @IsIn(['user', 'admin', 'manager']) // Definir papéis permitidos
    role?: string;
}