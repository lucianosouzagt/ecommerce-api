// tests/unit/services/ClientService.test.ts
import { ClientService } from '../../../src/services'; // Importe a classe
import { AppDataSource } from '../../../src/database'; // Para acessar o mock
import { Client } from '../../../src/database/entities/Client'; // Entidade
import { CreateClientDTO } from '../../../src/dtos/clients/CreateClientsDTO';


// 1. Mockar o TypeORM Data Source
// Este mock simulará o comportamento do AppDataSource e de seus repositórios
jest.mock('../../../src/database', () => ({
    AppDataSource: {
        getRepository: jest.fn(), // Mock da função getRepository
        // Mockar outras funções do DataSource se forem usadas diretamente no service
         createQueryRunner: jest.fn(), // Mock para transações
    },
}));

describe('ClientService', () => {
    let clientService: ClientService;
    let mockClientRepository: any; // Mock do repositório

    beforeAll(() => {
        // Configurar o mock do repositório ANTES de todos os testes
         // Criar um mock que se pareça com um Repository do TypeORM
        mockClientRepository = {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
             find: jest.fn(),
             delete: jest.fn(),
             merge: jest.fn(),
        };

         // Fazer com que AppDataSource.getRepository retorne nosso mock de repositório
        (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockClientRepository);

        // Instanciar o serviço APÓS o mock do repositório estar configurado
        clientService = new ClientService();
    });

     // Limpar mocks entre os testes se necessário
     afterEach(() => {
         jest.clearAllMocks(); // Limpa o estado de chamadas dos mocks
     });


    // Teste 1: Deve criar um cliente com sucesso (Red Phase)
    it('should create a client successfully', async () => {
        // Dados de entrada válidos
        const clientData: CreateClientDTO = {
            name: 'Test Client',
            email: 'test@example.com',
            phone: '11999998888',
        };

        // Simular o que o repositório faria: 'create' retorna uma nova instância, 'save' retorna a instância salva
        const createdClient = { id: 'some-uuid', ...clientData } as Client; // Objeto simulado após .create()
        const savedClient = { ...createdClient, createdAt: new Date(), updatedAt: new Date() } as Client; // Objeto simulado após .save()

        mockClientRepository.create.mockReturnValue(createdClient);
        mockClientRepository.save.mockResolvedValue(savedClient); // save é assíncrono

        // Chamar o método do serviço
        const result = await clientService.create(clientData);

        // Afirmações: O serviço chamou os métodos corretos do repositório e retornou o resultado esperado
        expect(mockClientRepository.create).toHaveBeenCalledWith(expect.objectContaining(clientData)); // Verificar se create foi chamado com dados transformados/validados
        expect(mockClientRepository.save).toHaveBeenCalledWith(createdClient);
        expect(result).toEqual(savedClient); // Verifica se o serviço retornou o objeto salvo
    });

    // Teste 2: Deve lançar erro se a validação de entrada falhar
     it('should throw validation error for invalid input data', async () => {
         const invalidData = {
             name: '', // Nome inválido (minLength)
             email: 'invalid-email',
         };
         // A mensagem de erro completa que o serviço irá gerar
        // Adapte esta string para corresponder *exatamente* ao que seu serviço lança
        // com base nos dados de entrada inválidos.
        const expectedErrorMessage = 'Dados do cliente inválidos: name must be longer than or equal to 3 characters, email must be an email';

        // Esperar que a promessa retorne um erro com a mensagem exata
        await expect(clientService.create(invalidData as any)).rejects.toThrow(expectedErrorMessage);

         // Verificar que os métodos do repositório NÃO foram chamados
         expect(mockClientRepository.create).not.toHaveBeenCalled();
         expect(mockClientRepository.save).not.toHaveBeenCalled();
     });

    // Teste 3: Deve lançar erro se o email já existir (se essa lógica estiver no service)
     it('should throw error if client with email already exists', async () => {
         const clientData: CreateClientDTO = {
             name: 'Existing Client',
             email: 'existing@example.com',
             phone: '11999998888',
         };

         // Simular que findOneBy retorna um cliente existente
         mockClientRepository.findOneBy.mockResolvedValue({ id: 'existing-uuid', ...clientData });

         await expect(clientService.create(clientData)).rejects.toThrow('Já existe um cliente com este email.'); // Assumindo que o service lança essa mensagem

         // Verificar que create e save NÃO foram chamados
         expect(mockClientRepository.create).not.toHaveBeenCalled();
         expect(mockClientRepository.save).not.toHaveBeenCalled();
     });


    // Adicionar testes para findById, findAll, update, delete e seus cenários de falha/sucesso
    // Exemplo para findById:
     it('should find a client by ID', async () => {
        const clientId = 'test-client-id';
        const mockClient = { id: clientId, name: 'Found Client' } as Client;

        mockClientRepository.findOneBy.mockResolvedValue(mockClient); // Simula encontrar o cliente

        const result = await clientService.findById(clientId);

        expect(mockClientRepository.findOneBy).toHaveBeenCalledWith({ id: clientId });
        expect(result).toEqual(mockClient);
     });

     it('should return null if client ID is not found', async () => {
         const clientId = 'non-existent-id';

        mockClientRepository.findOneBy.mockResolvedValue(null); // Simula não encontrar o cliente

        const result = await clientService.findById(clientId);

        expect(mockClientRepository.findOneBy).toHaveBeenCalledWith({ id: clientId });
        expect(result).toBeNull();
     });
});