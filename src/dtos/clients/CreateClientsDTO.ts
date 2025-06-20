// src/dtos/clients/CreateClientDTO.ts
import { IsString, IsEmail, IsOptional, Length, IsUUID } from 'class-validator';

export class CreateClientDTO {
  
    @IsString()
    @Length(3, 100)
    name!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @IsOptional() // Opcional para criação, pode ser obrigatório dependendo da regra
    phone?: string;
}