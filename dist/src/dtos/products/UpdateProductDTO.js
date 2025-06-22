var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/dtos/products/UpdateProductDTO.ts
import { IsString, Length, IsNumber, IsOptional, Min } from 'class-validator';
export class UpdateProductDTO {
    name;
    description;
    price;
}
__decorate([
    IsString(),
    Length(3, 255),
    IsOptional(),
    __metadata("design:type", String)
], UpdateProductDTO.prototype, "name", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateProductDTO.prototype, "description", void 0);
__decorate([
    IsNumber(),
    Min(0),
    IsOptional() // Preço opcional na atualização
    ,
    __metadata("design:type", Number)
], UpdateProductDTO.prototype, "price", void 0);
