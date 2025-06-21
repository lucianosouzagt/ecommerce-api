"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepositoryWithCustomMethods = exports.ProductRepository = void 0;
const Product_1 = require("../database/entities/Product"); // Ajuste o caminho
const database_1 = require("../database"); // Ajuste o caminho
exports.ProductRepository = database_1.AppDataSource.getRepository(Product_1.Product);
// Exemplo de um método customizado para buscar produtos ativos
exports.ProductRepositoryWithCustomMethods = exports.ProductRepository.extend({
    findActiveProducts() {
        return this.find({ where: { is_active: true } });
    }
});
