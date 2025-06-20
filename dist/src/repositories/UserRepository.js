"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepositoryWithCustomMethods = exports.UserRepository = void 0;
const User_1 = require("../database/entities/User"); // Ajuste o caminho conforme sua estrutura
const database_1 = __importDefault(require("../database")); // Ajuste o caminho conforme sua estrutura
// Exporta a instância do repositório diretamente
exports.UserRepository = database_1.default.getRepository(User_1.User);
// Podemos adicionar métodos customizados aqui se necessário
// Exemplo: buscar usuário por email (se AppDataSource já estiver inicializado)
exports.UserRepositoryWithCustomMethods = exports.UserRepository.extend({
    findByEmail(email) {
        return this.findOne({ where: { email } });
    }
});
