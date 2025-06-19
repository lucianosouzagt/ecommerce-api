"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// src/database/index.ts
const typeorm_1 = require("typeorm");
const dotenv = __importStar(require("dotenv"));
// Importar as entidades em inglês:
const User_1 = require("./entities/User");
const Client_1 = require("./entities/Client");
const Product_1 = require("./entities/Product");
const Order_1 = require("./entities/Order");
const OrderItem_1 = require("./entities/OrderItem");
const StockMovement_1 = require("./entities/StockMovement");
// Importar suas migrations
// Ex: import { CreateAllTables1718xxxxxxx } from "./migrations/1718xxxxxxx-CreateAllTables";
dotenv.config(); // Carregar variáveis do .env
const AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
    username: process.env.POSTGRES_USER || "user",
    password: process.env.POSTGRES_PASSWORD || "password",
    database: process.env.POSTGRES_DB || "mydatabase",
    synchronize: false, // Mantenha FALSE para usar migrations em produção
    logging: true, // Habilita logging das queries (útil em dev)
    entities: [
        User_1.User,
        Client_1.Client,
        Product_1.Product,
        Order_1.Order,
        OrderItem_1.OrderItem,
        StockMovement_1.StockMovement
    ], // LISTA DE TODAS AS SUAS ENTIDADES
    migrations: [
        "src/database/migrations/*.ts"
        // Liste seus arquivos de migration aqui
        // Ex: "src/database/migrations/*.ts"
    ],
    subscribers: [],
});
exports.default = AppDataSource; // Exporta para ser usado na aplicação
