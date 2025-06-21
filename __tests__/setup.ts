
// __tests__/setup.ts

// Mock do TypeORM DataSource
// Isso garante que AppDataSource.getRepository() sempre retorne um mock de repositório,
// sem tentar se conectar a um banco de dados real.
jest.mock('../src/database', () => ({
  AppDataSource: {
    // getRepository precisa retornar um objeto que simule o comportamento de um TypeORM Repository
    getRepository: jest.fn((entity) => {
        // Retorna um mock de repositório genérico para qualquer entidade.
        // Se precisar de comportamento específico para cada entidade, pode adicionar um 'if' aqui.
        return {
            create: jest.fn(data => data), // Simula o create, retornando os dados que seriam criados
            save: jest.fn(data => Promise.resolve(data)), // Simula o save, retornando uma Promise resolvida com os dados
            findOneBy: jest.fn(),
            find: jest.fn(),
            delete: jest.fn(async () => ({ affected: 1 })), // Simula o delete
            merge: jest.fn((entity, partialEntity) => ({ ...entity, ...partialEntity })),
            // Adicione outros métodos do TypeORM Repository que você usa (ex: findOne, update, count, etc.)
            // Aqui, você pode adicionar um mock para o método 'extend' se o seu ProductRepository.ts
            // ainda estiver chamando .extend() e você não quiser mockar o módulo ProductRepository inteiro.
            // extend: jest.fn((methods) => ({ ...this, ...methods })) // Este mock é para o caso de ProductRepository ser mockado diretamente
        };
    }),
    initialize: jest.fn().mockResolvedValue(null), // Mocka o initialize para não tentar conectar
    destroy: jest.fn().mockResolvedValue(null),   // Mocka o destroy
    // Mock outros métodos do AppDataSource se você os usar (ex: createQueryRunner)
    createQueryRunner: jest.fn().mockImplementation(() => ({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
            save: jest.fn(),
            findOneBy: jest.fn(),
            // Mock outros métodos do manager se usados em transações
        }
    })),
  },
}));


// Mock do Módulo ProductRepository
// Este mock é crucial para o erro `TypeError: Cannot read properties of undefined (reading 'extend')`.
// Ele substitui *completamente* o conteúdo de `src/repositories/ProductRepository.ts`
// por uma versão mockada, evitando que a linha `ProductRepository.extend()` seja executada.
jest.mock('../src/repositories/ProductRepository', () => {
    // Definimos um mock para o repositório base ProductRepository
    const mockProductRepositoryBase = {
        create: jest.fn(data => data),
        save: jest.fn(data => Promise.resolve(data)),
        findOneBy: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(async () => ({ affected: 1 })),
        merge: jest.fn((entity, partialEntity) => ({ ...entity, ...partialEntity })),
        // Adicione outros métodos comuns do TypeORM Repository que o ProductRepository pode usar
    };

    // Definimos um mock para o repositório customizado ProductRepositoryWithCustomMethods
    // Ele "estende" os métodos do mock base e adiciona os métodos customizados mockados
    const mockProductRepositoryWithCustomMethods = {
        ...mockProductRepositoryBase, // Inclui os métodos do mock base
        findActiveProducts: jest.fn(), // Mock do seu método customizado `findActiveProducts`
        // Adicione outros métodos customizados que você definiu no ProductRepository.ts
    };

    return {
        // Exportamos os objetos mockados que o módulo `ProductRepository.ts` deveria exportar.
        // Isso garante que qualquer arquivo que importe 'ProductRepository.ts' receba esses mocks,
        // e a linha `ProductRepository.extend({})` no arquivo original NUNCA será executada durante os testes.
        ProductRepository: mockProductRepositoryBase,
        ProductRepositoryWithCustomMethods: mockProductRepositoryWithCustomMethods,
    };
});

// Adicione outros mocks globais conforme necessário (ex: para módulos de terceiros, se forem problemáticos)