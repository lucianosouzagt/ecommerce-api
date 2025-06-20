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
exports.User = void 0;
// src/database/entities/User.ts
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator"); // <-- Adicione os decoradores
const Product_1 = require("./Product"); // Assumindo que Product tem createdBy/updatedBy
const Client_1 = require("./Client");
const Order_1 = require("./Order");
const OrderItem_1 = require("./OrderItem");
const StockMovement_1 = require("./StockMovement");
// Se preferir usar um Enum para os roles, defina-o aqui
// export enum UserRole { Admin = 'admin', User = 'user' }
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }) // Senhas devem ser armazenadas hasheadas!
    ,
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8) // <-- Exemplo: senha com no mínimo 8 caracteres
    ,
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'user' }) // Ex: 'admin', 'user'
    ,
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['admin', 'user']) // <-- Validar que o role está na lista permitida
    ,
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Product_1.Product, product => product.updated_by),
    __metadata("design:type", Array)
], User.prototype, "updatedProducts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Client_1.Client, client => client.updated_by),
    __metadata("design:type", Array)
], User.prototype, "updatedClients", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Order_1.Order, order => order.updated_by),
    __metadata("design:type", Array)
], User.prototype, "updatedOrders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => OrderItem_1.OrderItem, orderItem => orderItem.updated_by),
    __metadata("design:type", Array)
], User.prototype, "updatedOrdeItens", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => StockMovement_1.StockMovement, stockMovement => stockMovement.updated_by),
    __metadata("design:type", Array)
], User.prototype, "updatedStockMovement", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => User, user => user.updated_by),
    __metadata("design:type", Array)
], User.prototype, "updatedUsers", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: '' }) // Ex: 'admin', 'user'
    ,
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], User.prototype, "updated_by", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
