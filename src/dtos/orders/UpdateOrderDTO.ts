// src/dtos/orders/UpdateOrderDTO.ts
import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateOrderDTO {
    @IsString()
    @IsOptional()
    @IsIn(['Pendente', 'Processando', 'Enviado', 'Entregue', 'Cancelado', 'Pago']) // Validar status possíveis
    status?: string;

    // Não incluir campos como items ou totalAmount aqui para evitar modificações indevidas.
}