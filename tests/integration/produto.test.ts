// tests/integration/produto.test.ts
import request from 'supertest';
import app from '../../src/app'; // Importar a instância do app
import AppDataSource from '../../src/database'; // Importar a configuração do DB de teste

// Configurar DB de teste antes e depois dos testes
beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
         await AppDataSource.initialize();
    }
    // Limpar tabela de produtos
    await AppDataSource.getRepository('Produto').clear();
});

afterAll(async () => {
    await AppDataSource.destroy();
});

describe('GET /v1/produto', () => {
    it('should return an empty array initially', async () => {
        const res = await request(app).get('/v1/produto');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]); // Espera um array vazio
    });

    // Adicionar mais testes aqui conforme implementa
});