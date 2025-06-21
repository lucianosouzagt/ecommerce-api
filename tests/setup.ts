// tests/setup.ts
// Configurações globais de teste ou mocks comuns
import { AppDataSource } from '../src/database';
import { Repository } from 'typeorm'; // Importar Repository para tipagem
import { Client, Product, Order, OrderItem, StockMovement, User } from '../src/database/entities'; // Importe suas entidades conforme necessário

// Refinando a função createMockRepository para ser mais flexível
const createMockRepository = <T>(entity?: new () => T): jest.Mocked<any> => { // Use 'any' para flexibilidade com 'extend'
    const mockRepo: jest.Mocked<any> = {
        // Métodos básicos do repositório
        create: jest.fn(data => data), // create deve retornar o objeto de entrada
        save: jest.fn(data => Promise.resolve(data)), // save deve retornar uma promise resolvida com os dados
        findOneBy: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(async () => ({ affected: 1 })), // delete retorna uma promise
        merge: jest.fn((entity, partialEntity) => ({ ...entity, ...partialEntity })),
        // Adicione outros métodos TypeORM que você usa

        // Mock do método .extend() para repositórios customizados
        // Isso é para o caso de algum código de teste tentar usar .extend() diretamente
        extend: jest.fn((methods: any) => ({
            ...mockRepo, // Copia os métodos do repositório base
            ...methods,  // Adiciona os métodos customizados
        })),
    };
    return mockRepo;
};


// Mock global do AppDataSource
jest.mock('../src/database', () => ({
  AppDataSource: {
    // getRepository precisa retornar um mock de repositório
    getRepository: jest.fn((entity) => {
        // Você pode ter diferentes mocks para diferentes entidades
        if (entity && entity.name === 'Client') { // Use entity.name se não puder comparar o construtor diretamente
            return createMockRepository(); // Mock para Client
        }
        if (entity && entity.name === 'Product') { // Mock para Product
             return createMockRepository();
        }
        // Fallback genérico se a entidade não for explicitamente mockada
        return createMockRepository();
    }),
    // Mantenha os mocks para createQueryRunner, initialize, destroy
    createQueryRunner: jest.fn().mockImplementation(() => ({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
            save: jest.fn(),
            findOneBy: jest.fn(),
            findBy: jest.fn(),
            create: jest.fn(),
            merge: jest.fn(),
            delete: jest.fn(),
            // Adicione outros métodos do manager que você usar nas transações
        }
    })),
    initialize: jest.fn().mockResolvedValue(null),
    destroy: jest.fn().mockResolvedValue(null),
  },
}));

// ESTE É O MOCK CRUCIAL PARA O ERRO `extend`
// Ele substitui *completamente* o conteúdo de `src/repositories/ProductRepository.ts`
// quando qualquer módulo o importa durante os testes.
jest.mock('../src/repositories/ProductRepository', () => {
    // Crie um mock do repositório base ProductRepository
    const mockProductRepositoryBase = {
        // Mock todos os métodos do repositório TypeORM que você usa no ProductRepository
        create: jest.fn(data => data),
        save: jest.fn(data => Promise.resolve(data)),
        findOneBy: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(async () => ({ affected: 1 })),
        merge: jest.fn((entity, partialEntity) => ({ ...entity, ...partialEntity })),
        // ... (adicione outros métodos comuns do repositório, como findOne, findAndCount, etc.)
    };

    // Crie um mock para o ProductRepositoryWithCustomMethods
    // Este objeto já conterá os métodos base mockados e os métodos customizados mockados
    const mockProductRepositoryWithCustomMethods = {
        ...mockProductRepositoryBase, // "Estenda" com os métodos do mock base
        findActiveProducts: jest.fn(), // Mock do seu método customizado
        // ... (adicione outros métodos customizados que você definiu no ProductRepository.ts)
    };

    return {
        // Exporta os objetos mockados que o módulo `ProductRepository.ts` deveria exportar
        // Isso garante que quem importar 'ProductRepository.ts' receba esses mocks,
        // e a linha ProductRepository.extend({}) no arquivo original NUNCA será executada.
        ProductRepository: mockProductRepositoryBase,
        ProductRepositoryWithCustomMethods: mockProductRepositoryWithCustomMethods,
    };
});