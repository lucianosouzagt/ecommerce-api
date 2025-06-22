// src/database/repositories/ClientRepository.ts
import { Repository, DataSource, DeleteResult } from 'typeorm'; 
import { AppDataSource } from '../database/index.js'; 
import { Client } from '../database/entities/Client.js'; 


/**
 * Interface que define os métodos customizados que serão adicionados ao ClientRepository.
 */
interface ClientRepositoryCustom {
    /**
     * Encontra todos os clientes.
     * @returns Uma Promise que resolve para um array de entidades Client.
     */
    findAll(): Promise<Client[]>; // Novo método: findAll

    /**
     * Encontra clientes que estão "ativos".
     * @returns Uma Promise que resolve para um array de entidades Client.
     */
    findActiveClients(): Promise<Client[]>;

    /**
     * Encontra um cliente pelo email.
     * @param email O email do cliente a ser buscado.
     * @returns Uma Promise que resolve para a entidade Client ou null se não encontrada.
     */
    findByEmail(email: string): Promise<Client | null>;

    /**
     * Cria e salva um novo cliente no banco de dados.
     * @param clientData Os dados do cliente a serem criados.
     * @returns Uma Promise que resolve para a entidade Client criada.
     */
    create(clientData: Partial<Client>): Promise<Client>; // Novo método: createClient

    /**
     * Atualiza um cliente existente no banco de dados.
     * @param id O ID do cliente a ser atualizado.
     * @param updateData Os dados a serem atualizados no cliente.
     * @returns Uma Promise que resolve para a entidade Client atualizada ou null se o cliente não for encontrado.
     */
    update(id: string, updateData: Partial<Client>): Promise<Client | null>; // Novo método: updateClient

    /**
     * Deleta um cliente do banco de dados pelo ID.
     * @param id O ID do cliente a ser deletado.
     * @returns Uma Promise que resolve para true se o cliente foi deletado com sucesso, false caso contrário.
     */
    delete(id: string): Promise<boolean>; // Novo método: deleteClient
}

/**
 * Repositório customizado para a entidade Client.
 * Ele estende o repositório base do TypeORM e adiciona métodos específicos para Client.
 */
export const ClientRepository = AppDataSource.getRepository(Client).extend({
    
    async findAll(): Promise<Client[]> {
        return this.find(); 
    },

    async findByEmail(email: string): Promise<Client | null> {
        return this.findOne({ where: { email: email } });
    },

    async create(clientData: Partial<Client>): Promise<Client> {
        const newClient = this.create(clientData); 
        return this.save(newClient); 
    },

    async update(id: string, updateData: Partial<Client>): Promise<Client | null> {
        const clientToUpdate = await this.findOne({ where: { id: id } });

        if (!clientToUpdate) {
            return null; 
        }

        Object.assign(clientToUpdate, updateData);

        return this.save(clientToUpdate);
    },

    async delete(id: string): Promise<boolean> {
        const deleteResult: DeleteResult = await this.delete(id); 

        return !!deleteResult.affected && deleteResult.affected > 0;
    }
});
