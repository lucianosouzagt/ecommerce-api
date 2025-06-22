// src/services/ClientService.ts
import { AppDataSource } from '../database/index.js';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Client } from '../database/entities/Client.js';
import { CreateClientDTO } from '../dtos/clients/CreateClientsDTO.js';

import { Repository } from 'typeorm';

export class ClientService {
    private clientRepository: Repository<Client>;

    // O repositório é injetado no construtor
    constructor(clientRepository?: Repository<Client>) {
        this.clientRepository = clientRepository || AppDataSource.getRepository(Client);
    }

    async create(clientData: CreateClientDTO): Promise<Client> {
        const clientDto = plainToInstance(CreateClientDTO, clientData);
        const errors = await validate(clientDto);
        if (errors.length > 0) {
            const errorMessages = errors.map(err => Object.values(err.constraints || {})).flat();
            throw new Error(`Dados do cliente inválidos: ${errorMessages.join(', ')}`);
        }

        const existingClient = await this.clientRepository.findOneBy({ email: clientData.email });
        if (existingClient) {
            throw new Error('Já existe um cliente com este email.');
        }

        const client = this.clientRepository.create(clientData);
        const savedClient = await this.clientRepository.save(client);
        return savedClient;
    }

    async findByEmail(email: string): Promise<Client | null> {
        return this.clientRepository.findOneBy({ email });
    }

    async findById(id: string): Promise<Client | null> {
        return this.clientRepository.findOneBy({ id });
    }

    async findAll(): Promise<Client[]> {
        return this.clientRepository.find();
    }

    async update(id: string, clientData: Partial<CreateClientDTO>): Promise<Client | null> {
        const client = await this.clientRepository.findOneBy({ id });
        if (!client) {
            return null;
        }
        this.clientRepository.merge(client, clientData);
        const updatedClient = await this.clientRepository.save(client);
        return updatedClient;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.clientRepository.delete(id);
        //return result.affected > 0;
        return !!result.affected && result.affected > 0;
    }
}
// Exportar uma instância padrão
export const clientService = new ClientService();