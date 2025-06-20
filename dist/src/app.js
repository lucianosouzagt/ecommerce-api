"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts (Exemplo de adição do Global Error Handler)
const express_1 = __importDefault(require("express")); // Importar NextFunction
const produto_routes_1 = __importDefault(require("./routes/produto.routes"));
// ... outras importações
const app = (0, express_1.default)();
// Middlewares globais (parsing JSON, etc.)
app.use(express_1.default.json());
// Montar rotas
app.use('/v1/produto', produto_routes_1.default);
// app.use('/v1/cliente', clientRoutes);
// ...
app.get('/', (req, res) => {
    res.send('API de Produtos rodando!');
});
// Middleware de tratamento de erros global (DEVE ser o último middleware)
app.use((err, req, res, next) => {
    console.error(err); // Log o erro no console do servidor
    // Você pode adicionar lógica aqui para decidir o status code e a mensagem
    // com base no tipo de erro (ex: 400 para bad requests, 404 para not found, 500 para erros internos)
    const statusCode = err.status || 500;
    const message = err.message || 'An unexpected error occurred';
    res.status(statusCode).json({
        message: message,
        // Opcional: incluir o stack trace em ambientes de desenvolvimento para debugging
        // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
});
exports.default = app;
