// src/dtos/users/UpdateUserDTO.ts
import { IsString, IsEmail, Length, IsOptional, IsIn } from 'class-validator';

export class UpdateUserDTO {
    @IsString()
    @Length(3, 100)
    @IsOptional() // Todos opcionais para atualização
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @Length(6, 50)
    @IsOptional() // Senha opcional na atualização
    password?: string;

    @IsString()
    @IsOptional()
    @IsIn(['user', 'admin', 'manager']) // Definir papéis permitidos
    role?: string;
}