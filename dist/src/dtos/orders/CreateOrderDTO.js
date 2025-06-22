var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsUUID, IsNumber, IsEnum, IsNotEmpty, ArrayMinSize, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
export var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["COMPLETED"] = "completed";
    OrderStatus["CANCELED"] = "canceled";
})(OrderStatus || (OrderStatus = {}));
class OrderItemDTO {
    productId;
    quantity;
}
__decorate([
    IsUUID(),
    __metadata("design:type", String)
], OrderItemDTO.prototype, "productId", void 0);
__decorate([
    IsNumber(),
    Min(1),
    __metadata("design:type", Number)
], OrderItemDTO.prototype, "quantity", void 0);
export class CreateOrderDTO {
    clientId;
    status;
    items;
}
__decorate([
    IsUUID('4', { message: 'O ID do cliente deve ser um UUID válido.' }),
    IsNotEmpty({ message: 'O ID do cliente não pode ser vazio.' }),
    __metadata("design:type", String)
], CreateOrderDTO.prototype, "clientId", void 0);
__decorate([
    IsEnum(OrderStatus, { message: 'O status do pedido deve ser um dos valores permitidos.' }),
    IsNotEmpty({ message: 'O status do pedido não pode ser vazio.' }),
    __metadata("design:type", String)
], CreateOrderDTO.prototype, "status", void 0);
__decorate([
    ArrayMinSize(1, { message: 'O pedido deve conter pelo menos um item.' }),
    ValidateNested({ each: true }),
    Type(() => OrderItemDTO),
    __metadata("design:type", Array)
], CreateOrderDTO.prototype, "items", void 0);
