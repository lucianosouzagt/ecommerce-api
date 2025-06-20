// src/dtos/clients/UpdateClientDTO.ts
import { IsString, IsEmail, IsOptional, Length, IsUUID } from 'class-validator';

export class UpdateClientDTO {
    @IsString()
    @Length(3, 100)
    @IsOptional() // Todos opcionais para atualização
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    phone?: string;
}