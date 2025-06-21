// src/server.ts
import "reflect-metadata"; // Deve ser a primeira linha

import app from './app';
import { AppDataSource } from './database';
import * as dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected!");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => console.error("Database connection error:", error));
