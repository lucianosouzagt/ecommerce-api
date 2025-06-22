var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/dtos/users/UpdateUserDTO.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
// Usamos IsOptional para permitir atualizações parciais
export class UpdateUserDTO {
    name;
    email;
    password; // A senha será hashed se presente
}
__decorate([
    IsOptional(),
    IsString(),
    IsNotEmpty({ message: 'Name cannot be empty' }),
    __metadata("design:type", String)
], UpdateUserDTO.prototype, "name", void 0);
__decorate([
    IsOptional(),
    IsEmail({}, { message: 'Invalid email format' }),
    IsNotEmpty({ message: 'Email cannot be empty' }),
    __metadata("design:type", String)
], UpdateUserDTO.prototype, "email", void 0);
__decorate([
    IsOptional(),
    IsString(),
    MinLength(8, { message: 'Password must be at least 8 characters long' }),
    __metadata("design:type", String)
], UpdateUserDTO.prototype, "password", void 0);
