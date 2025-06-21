"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStockMovementDTO = void 0;
// src/dtos/stockMovements/CreateStockMovementDTO.ts
const class_validator_1 = require("class-validator");
class CreateStockMovementDTO {
}
exports.CreateStockMovementDTO = CreateStockMovementDTO;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateStockMovementDTO.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsInt)() // Quantidade pode ser positiva (entrada) ou negativa (saída)
    ,
    (0, class_validator_1.IsNumber)() // Usar IsNumber pois quantidade pode ser 0 ou negativa
    ,
    __metadata("design:type", Number)
], CreateStockMovementDTO.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['Entrada', 'Saída (Pedido)', 'Saída (Perda)', 'Entrada (Ajuste)', 'Saída (Ajuste)']) // Tipos de movimento permitidos
    ,
    __metadata("design:type", String)
], CreateStockMovementDTO.prototype, "movementType", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)() // Opcional, se o movimento está ligado a um OrderItem
    ,
    __metadata("design:type", String)
], CreateStockMovementDTO.prototype, "orderItemId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStockMovementDTO.prototype, "reference", void 0);
