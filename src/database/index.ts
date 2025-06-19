// src/database/index.ts
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
// Importar as entidades em inglês:
import { User } from "./entities/User";
import { Client } from "./entities/Client";
import { Product } from "./entities/Product";
import { Order } from "./entities/Order";
import { OrderItem } from "./entities/OrderItem";
import { StockMovement } from "./entities/StockMovement";
// Importar suas migrations
// Ex: import { CreateAllTables1718xxxxxxx } from "./migrations/1718xxxxxxx-CreateAllTables";

dotenv.config(); // Carregar variáveis do .env

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
    username: process.env.POSTGRES_USER || "user",
    password: process.env.POSTGRES_PASSWORD || "password",
    database: process.env.POSTGRES_DB || "mydatabase",
    synchronize: false, // Mantenha FALSE para usar migrations em produção
    logging: true, // Habilita logging das queries (útil em dev)
    entities: [
        User,
        Client,
        Product,
        Order,
        OrderItem,
        StockMovement
    ], // LISTA DE TODAS AS SUAS ENTIDADES
    migrations: [
        "src/database/migrations/*.ts"
        // Liste seus arquivos de migration aqui
        // Ex: "src/database/migrations/*.ts"
    ],
    subscribers: [],
});

export default AppDataSource; // Exporta para ser usado na aplicação