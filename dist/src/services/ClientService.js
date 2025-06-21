"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientService = exports.ClientService = void 0;
// src/services/ClientService.ts
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const Client_1 = require("../database/entities/Client");
const database_1 = require("../database"); // Assumindo que seu data-source está aqui
// DTOs (Data Transfer Objects) para entrada de dados
// Crie esses arquivos em, por exemplo, src/dtos/clients/
const CreateClientsDTO_1 = require("../dtos/clients/CreateClientsDTO");
// src/services/ClientService.ts (Versão Corrigida)
class ClientService {
    // Agora, o construtor pode receber um repositório como argumento
    // Isso é útil para injeção de dependência em testes
    constructor(clientRepository) {
        // Se um repositório for fornecido, use-o; caso contrário, obtenha-o do AppDataSource
        this.clientRepository = clientRepository || database_1.AppDataSource.getRepository(Client_1.Client);
    }
    async create(clientData) {
        const clientDto = (0, class_transformer_1.plainToInstance)(CreateClientsDTO_1.CreateClientDTO, clientData);
        const errors = await (0, class_validator_1.validate)(clientDto);
        if (errors.length > 0) {
            const errorMessages = errors.map(err => Object.values(err.constraints || {})).flat();
            throw new Error(`Dados do cliente inválidos: ${errorMessages.join(', ')}`);
        }
        const existingClient = await this.clientRepository.findOneBy({ email: clientData.email });
        if (existingClient) {
            throw new Error('Já existe um cliente com este email.');
        }
        const client = this.clientRepository.create(clientData); // Entidade criada, sem datas
        const savedClient = await this.clientRepository.save(client); // Entidade salva, AGORA COM DATAS
        return savedClient; // <--- RETORNE A ENTIDADE ATUALIZADA APÓS O SAVE!
    }
    // ... (Mantenha os outros métodos)
    async findById(id) {
        return this.clientRepository.findOneBy({ id });
    }
    async findAll() {
        return this.clientRepository.find();
    }
    async update(id, clientData) {
        const client = await this.clientRepository.findOneBy({ id });
        if (!client) {
            return null;
        }
        this.clientRepository.merge(client, clientData);
        const updatedClient = await this.clientRepository.save(client); // Retorne o resultado do save
        return updatedClient;
    }
    async delete(id) {
        const result = await this.clientRepository.delete(id);
        return !!result.affected && result.affected > 0;
    }
}
exports.ClientService = ClientService;
// Exportar uma instância padrão
exports.clientService = new ClientService();
