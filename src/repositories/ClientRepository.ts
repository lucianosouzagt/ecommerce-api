// src/database/repositories/ClientRepository.ts
import { Repository } from 'typeorm';
import { Client } from '../database/entities/Client'; // Ajuste o caminho conforme sua estrutura
import AppDataSource from '../database'; // Ajuste o caminho conforme sua estrutura

export const ClientRepository: Repository<Client> = AppDataSource.getRepository(Client);

// Exemplo de um método customizado (para adicionar no futuro, se necessário)
/*
export const ClientRepositoryWithCustomMethods = ClientRepository.extend({
    findActiveClients() {
        return this.find({ where: { active: true } });
    }
});
*/