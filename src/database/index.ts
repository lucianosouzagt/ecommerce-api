// src/database/index.ts
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

import { User } from "./entities/User.js";
import { Client } from "./entities/Client.js";
import { Product } from "./entities/Product.js";
import { Order } from "./entities/Order.js";
import { OrderItem } from "./entities/OrderItem.js";
import { StockMovement } from "./entities/StockMovement.js";

dotenv.config(); 
export const AppDataSource = new DataSource({
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
        "src/database/migrations/*.ts",
        "src/database/seeds/*.ts"
    ],
    subscribers: [],
});