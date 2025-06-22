// src/app.ts (Exemplo de adição do Global Error Handler)
import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.routes.js';
import clientRoutes from './routes/client.routes.js';
import productRoutes from './routes/produto.routes.js';
import orderRoutes from './routes/order.routes.js';
import stockMovementRoutes from './routes/stockMovement.routes.js';
const app = express();
// Middlewares globais (parsing JSON, etc.)
app.use(express.json());
app.use(bodyParser.json());
// Montar rotas
app.use('/v1/user', userRoutes);
app.use('/v1/client', clientRoutes);
app.use('/v1/product', productRoutes);
app.use('/v1/order', orderRoutes);
app.use('/v1/stock', stockMovementRoutes);
// ...
app.get('/', (req, res) => {
    res.send('API de Produtos rodando!');
});
// Rota de fallback para 404 - deve vir por último, antes do middleware de erro
app.use((req, res, next) => {
    res.status(404).send({ message: 'Resource not found' });
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
export default app;
