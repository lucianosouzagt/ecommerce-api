var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/dtos/orders/CreateOrderItemDTO.ts
import { IsUUID, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
export class CreateOrderItemDTO {
    productId;
    quantity;
}
__decorate([
    IsUUID('4', { message: 'O ID do produto deve ser um UUID válido.' }),
    IsNotEmpty({ message: 'O ID do produto não pode ser vazio.' }),
    __metadata("design:type", String)
], CreateOrderItemDTO.prototype, "productId", void 0);
__decorate([
    IsNumber({}, { message: 'A quantidade deve ser um número.' }),
    IsPositive({ message: 'A quantidade deve ser um número positivo.' }),
    IsNotEmpty({ message: 'A quantidade não pode ser vazia.' }),
    __metadata("design:type", Number)
], CreateOrderItemDTO.prototype, "quantity", void 0);
