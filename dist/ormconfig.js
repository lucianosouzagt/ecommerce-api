// ormconfig.ts
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
dotenv.config();
const ormConfig = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
    username: process.env.POSTGRES_USER || "user",
    password: process.env.POSTGRES_PASSWORD || "password",
    database: process.env.POSTGRES_DB || "mydatabase",
    synchronize: false,
    logging: true,
    entities: [
        "src/database/entities/**/*.ts" // Caminho para suas entidades
    ],
    migrations: [
        "src/database/migrations/**/*.ts" // Caminho para suas migrations
    ],
    subscribers: [],
});
export default ormConfig;
