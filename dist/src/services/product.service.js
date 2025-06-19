"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
// src/services/produto.service.ts
const database_1 = __importDefault(require("../database"));
const Product_1 = require("../database/entities/Product");
class ProductService {
    constructor() {
        this.productRepository = database_1.default.getRepository(Product_1.Product);
    }
    async findAll() {
        return this.productRepository.find();
    }
    async findById(id) {
        return this.productRepository.findOneBy({ id });
    }
}
exports.ProductService = ProductService;
