// tests/unit/controllers/ClientController.test.ts

import { ClientController } from '../../../src/controllers/ClientController';
import { ClientService } from '../../../src/services'; // Importa a CLASSE do serviço
import { Request, Response } from 'express';
import { Client } from '../../../src/database/entities/Client'; // Ajuste o caminho se necessário
import { CreateClientDTO } from '../../../src/dtos/clients/CreateClientsDTO'; // Importa o DTO

// Define o tipo para o seu mock de ClientService
// Isso garante que o objeto mockado tenha os métodos esperados com a tipagem correta
type MockedClientService = {
    create: jest.Mock<Promise<Client>, [CreateClientDTO]>;
    findById: jest.Mock<Promise<Client | null>, [string]>;
    findAll: jest.Mock<Promise<Client[]>, []>;
    update: jest.Mock<Promise<Client | null>, [string, Partial<CreateClientDTO>]>;
    delete: jest.Mock<Promise<boolean>, [string]>;
};

describe('ClientController', () => {
    let clientController: ClientController;
    let mockClientService: MockedClientService;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        // Limpa todos os mocks antes de cada teste
        jest.clearAllMocks();

        // 1. Cria o MOCK do ClientService
        mockClientService = {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        // 2. Instancia o ClientController, INJETANDO o mock do ClientService
        // O `as any` é necessário porque MockedClientService não é ClientService completo,
        // mas suficiente para a interface pública que o controller utiliza.
        clientController = new ClientController(mockClientService as any);

        // 3. Configura os mocks para os objetos Response do Express
        mockResponse = {
            status: jest.fn().mockReturnThis(), // Permite encadeamento .status().json()
            json: jest.fn(),
            send: jest.fn(), // Usado para respostas sem corpo (ex: 204 No Content)
        };
    });

    // Testes para o método CREATE
    describe('create', () => {
        // Declaração do mockRequest específica para este `describe`,
        // que não exige parâmetros de rota específicos.
        let mockRequest: Partial<Request>;

        beforeEach(() => {
            // Reinicia mockRequest antes de cada teste neste `describe`
            mockRequest = {};
        });

        it('should create a client successfully and return 201', async () => {
            const clientData: CreateClientDTO = { name: 'Test Client', email: 'test@example.com', phone: '11999998888' };

            // Trata 'phone' para ser `string | null` conforme a entidade
            const clientPhoneValue: string | null = clientData.phone !== undefined ? clientData.phone : null;

            // Objeto `Client` completo, conforme a entidade Client.ts
            const createdClient: Client = {
                id: 'some-uuid-1',
                name: clientData.name,
                email: clientData.email,
                phone: clientPhoneValue,
                address: null, // Definido como null, pois é nullable e não está no DTO de criação
                isActive: true, // Propriedade obrigatória com default `true`
                orders: [], // Relação OneToMany obrigatória, inicia vazia
                updated_by: null, // Relação ManyToOne, pode ser null para um novo cliente
                created_at: new Date('2025-06-21T10:00:00Z'), // Data fixa para testes
                updated_at: new Date('2025-06-21T10:00:00Z'), // Data fixa para testes
            };

            // Configura o mock do serviço para resolver com o `createdClient`
            mockClientService.create.mockResolvedValue(createdClient);

            mockRequest.body = clientData; // Simula o corpo da requisição

            // Chama o método do controller, com o cast `as Request`
            await clientController.create(mockRequest as Request, mockResponse as Response);

            // Verifica as expectativas
            expect(mockClientService.create).toHaveBeenCalledWith(clientData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(createdClient);
        });

        it('should return 400 for invalid input data (validation error)', async () => {
            const invalidData: CreateClientDTO = { name: 'ab', email: 'invalid-email', phone: '123' };
            const validationErrorMessage = 'Dados do cliente inválidos: name must be longer than or equal to 3 characters, email must be an email';

            mockClientService.create.mockRejectedValue(new Error(validationErrorMessage));

            mockRequest.body = invalidData;

            await clientController.create(mockRequest as Request, mockResponse as Response);

            expect(mockClientService.create).toHaveBeenCalledWith(invalidData);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: validationErrorMessage });
        });

        it('should return 400 if client with email already exists', async () => {
            const existingClientData: CreateClientDTO = { name: 'Existing User', email: 'existing@example.com', phone: '99999999999' };
            const errorMessage = 'Já existe um cliente com este email.';

            mockClientService.create.mockRejectedValue(new Error(errorMessage));

            mockRequest.body = existingClientData;

            await clientController.create(mockRequest as Request, mockResponse as Response);

            expect(mockClientService.create).toHaveBeenCalledWith(existingClientData);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
        });

        it('should return 500 for an internal server error', async () => {
            const clientData: CreateClientDTO = { name: 'Error Client', email: 'error@example.com', phone: '11111111111' };
            const internalErrorMessage = 'Database connection failed';

            mockClientService.create.mockRejectedValue(new Error(internalErrorMessage));

            mockRequest.body = clientData;

            await clientController.create(mockRequest as Request, mockResponse as Response);

            expect(mockClientService.create).toHaveBeenCalledWith(clientData);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Erro interno do servidor.' });
        });
    });

    // Testes para o método FIND BY ID
    describe('findById', () => {
        // Declaração do mockRequest específica para este `describe`,
        // exigindo um `id` nos parâmetros de rota (`req.params.id`).
        let mockRequest: Partial<Request<{ id: string }>>;

        beforeEach(() => {
            mockRequest = {};
        });

        it('should find a client by ID and return 200', async () => {
            const clientId = 'found-id-123';
            // Objeto `Client` completo
            const foundClient: Client = {
                id: clientId,
                name: 'Found Client',
                email: 'found@example.com',
                phone: '11111111111',
                address: null,
                isActive: true,
                orders: [],
                updated_by: null,
                created_at: new Date('2025-06-21T10:00:00Z'),
                updated_at: new Date('2025-06-21T10:00:00Z'),
            };

            mockClientService.findById.mockResolvedValue(foundClient);

            mockRequest.params = { id: clientId }; // Define o parâmetro de rota

            // Chama o método do controller, com o cast `as Request<{ id: string }>`
            await clientController.findById(mockRequest as Request<{ id: string }>, mockResponse as Response);

            expect(mockClientService.findById).toHaveBeenCalledWith(clientId);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(foundClient);
        });

        it('should return 404 if client ID is not found', async () => {
            const clientId = 'non-existent-id';

            mockClientService.findById.mockResolvedValue(null);

            mockRequest.params = { id: clientId };

            await clientController.findById(mockRequest as Request<{ id: string }>, mockResponse as Response);

            expect(mockClientService.findById).toHaveBeenCalledWith(clientId);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Cliente não encontrado.' });
        });

        it('should return 500 for an internal server error when finding by ID', async () => {
            const clientId = 'error-id';
            const internalErrorMessage = 'Database query failed';

            mockClientService.findById.mockRejectedValue(new Error(internalErrorMessage));

            mockRequest.params = { id: clientId };

            await clientController.findById(mockRequest as Request<{ id: string }>, mockResponse as Response);

            expect(mockClientService.findById).toHaveBeenCalledWith(clientId);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Erro interno do servidor.' });
        });
    });

    // Testes para o método FIND ALL
    describe('findAll', () => {
        // Declaração do mockRequest para `findAll` (não exige parâmetros de rota específicos)
        let mockRequest: Partial<Request>;

        beforeEach(() => {
            mockRequest = {};
        });

        it('should return all clients and return 200', async () => {
            // Array de objetos `Client` completos
            const clients: Client[] = [
                {
                    id: '1', name: 'Client A', email: 'a@test.com', phone: null, address: null,
                    isActive: true, orders: [], updated_by: null,
                    created_at: new Date('2025-06-20T10:00:00Z'), updated_at: new Date('2025-06-20T10:00:00Z')
                },
                {
                    id: '2', name: 'Client B', email: 'b@test.com', phone: '12345678901', address: 'Rua B',
                    isActive: true, orders: [], updated_by: null,
                    created_at: new Date('2025-06-20T11:00:00Z'), updated_at: new Date('2025-06-20T11:00:00Z')
                },
            ];

            mockClientService.findAll.mockResolvedValue(clients);

            await clientController.findAll(mockRequest as Request, mockResponse as Response);

            expect(mockClientService.findAll).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(clients);
        });

        it('should return 500 for an internal server error when finding all clients', async () => {
            const internalErrorMessage = 'Failed to fetch all clients';

            mockClientService.findAll.mockRejectedValue(new Error(internalErrorMessage));

            await clientController.findAll(mockRequest as Request, mockResponse as Response);

            expect(mockClientService.findAll).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Erro interno do servidor.' });
        });
    });

    // Testes para o método UPDATE
    describe('update', () => {
        // Declaração do mockRequest para `update` (exige `id` nos parâmetros de rota)
        let mockRequest: Partial<Request<{ id: string }>>;

        beforeEach(() => {
            mockRequest = {};
        });

        it('should update a client successfully and return 200', async () => {
            const clientId = 'update-id';
            const updateData: Partial<CreateClientDTO> = { name: 'Updated Name', phone: '98765432100' };

            // Simula o cliente que existia antes da atualização
            const existingClient: Client = {
                id: clientId,
                name: 'Original Name',
                email: 'original@example.com',
                phone: '11111111111',
                address: 'Original Address',
                isActive: true,
                orders: [],
                updated_by: null,
                created_at: new Date('2025-06-20T09:00:00Z'),
                updated_at: new Date('2025-06-20T09:00:00Z'),
            };

            // Simula o cliente APÓS a atualização (com as propriedades atualizadas)
            const updatedClient: Client = {
                ...existingClient, // Mantém as propriedades não alteradas
                name: updateData.name || existingClient.name, // Aplica a atualização do nome
                phone: updateData.phone !== undefined ? updateData.phone : existingClient.phone, // Aplica a atualização do telefone, tratando undefined
                updated_at: new Date('2025-06-21T12:00:00Z'), // Simula a data de atualização
            };

            mockClientService.update.mockResolvedValue(updatedClient);

            mockRequest.params = { id: clientId };
            mockRequest.body = updateData;

            await clientController.update(mockRequest as Request<{ id: string }>, mockResponse as Response);

            expect(mockClientService.update).toHaveBeenCalledWith(clientId, updateData);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(updatedClient);
        });

        it('should return 404 if client to update is not found', async () => {
            const clientId = 'non-existent-update-id';
            const updateData: Partial<CreateClientDTO> = { name: 'Non Existent' };

            mockClientService.update.mockResolvedValue(null);

            mockRequest.params = { id: clientId };
            mockRequest.body = updateData;

            await clientController.update(mockRequest as Request<{ id: string }>, mockResponse as Response);

            expect(mockClientService.update).toHaveBeenCalledWith(clientId, updateData);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Cliente não encontrado para atualização.' });
        });

        it('should return 500 for an internal server error when updating', async () => {
            const clientId = 'error-update-id';
            const updateData: Partial<CreateClientDTO> = { name: 'Error Update' };
            const internalErrorMessage = 'Update operation failed';

            mockClientService.update.mockRejectedValue(new Error(internalErrorMessage));

            mockRequest.params = { id: clientId };
            mockRequest.body = updateData;

            await clientController.update(mockRequest as Request<{ id: string }>, mockResponse as Response);

            expect(mockClientService.update).toHaveBeenCalledWith(clientId, updateData);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Erro interno do servidor.' });
        });
    });

    // Testes para o método DELETE
    describe('delete', () => {
        // Declaração do mockRequest para `delete` (exige `id` nos parâmetros de rota)
        let mockRequest: Partial<Request<{ id: string }>>;

        beforeEach(() => {
            mockRequest = {};
        });

        it('should delete a client successfully and return 204', async () => {
            const clientId = 'delete-id';

            mockClientService.delete.mockResolvedValue(true); // Serviço indica sucesso na exclusão

            mockRequest.params = { id: clientId };

            await clientController.delete(mockRequest as Request<{ id: string }>, mockResponse as Response);

            expect(mockClientService.delete).toHaveBeenCalledWith(clientId);
            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalledTimes(1); // 204 No Content, geralmente usa .send() sem corpo
        });

        it('should return 404 if client to delete is not found', async () => {
            const clientId = 'non-existent-delete-id';

            mockClientService.delete.mockResolvedValue(false); // Serviço indica que não encontrou/excluiu

            mockRequest.params = { id: clientId };

            await clientController.delete(mockRequest as Request<{ id: string }>, mockResponse as Response);

            expect(mockClientService.delete).toHaveBeenCalledWith(clientId);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Cliente não encontrado para exclusão.' });
        });

        it('should return 500 for an internal server error when deleting', async () => {
            const clientId = 'error-delete-id';
            const internalErrorMessage = 'Delete operation failed';

            mockClientService.delete.mockRejectedValue(new Error(internalErrorMessage));

            mockRequest.params = { id: clientId };

            await clientController.delete(mockRequest as Request<{ id: string }>, mockResponse as Response);

            expect(mockClientService.delete).toHaveBeenCalledWith(clientId);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Erro interno do servidor.' });
        });
    });
});