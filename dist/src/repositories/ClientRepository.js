"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRepository = void 0;
const Client_1 = require("../database/entities/Client"); // Ajuste o caminho conforme sua estrutura
const database_1 = __importDefault(require("../database")); // Ajuste o caminho conforme sua estrutura
exports.ClientRepository = database_1.default.getRepository(Client_1.Client);
// Exemplo de um método customizado (para adicionar no futuro, se necessário)
/*
export const ClientRepositoryWithCustomMethods = ClientRepository.extend({
    findActiveClients() {
        return this.find({ where: { active: true } });
    }
});
*/ 
