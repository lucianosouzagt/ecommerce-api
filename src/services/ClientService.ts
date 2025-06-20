// src/services/ClientService.ts
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Client } from '../database/entities/Client';
import AppDataSource from '../database'; // Assumindo que seu data-source está aqui

// DTOs (Data Transfer Objects) para entrada de dados
// Crie esses arquivos em, por exemplo, src/dtos/clients/
import { CreateClientDTO } from '../dtos/clients/CreateClientsDTO';
import { UpdateClientDTO } from '../dtos/clients/UpdateClientDTO';

const clientRepository = AppDataSource.getRepository(Client);

export class ClientService {

    /**
     * Cria um novo cliente no sistema.
     * @param clientData Dados do cliente a ser criado.
     * @returns O cliente criado.
     * @throws Error se a validação falhar ou se ocorrer um erro no banco.
     */
    async create(clientData: CreateClientDTO): Promise<Client> {
        // 1. Validação usando class-validator/transformer
        const clientInstance = plainToInstance(CreateClientDTO, clientData);
        const errors = await validate(clientInstance);

        if (errors.length > 0) {
            // Tratar erros de validação - lançar exceção ou retornar objeto de erro
            console.error('Validation failed: ', errors);
            throw new Error('Dados do cliente inválidos.'); // Exemplo simples, adaptar para sua necessidade
        }

        // 2. Lógica de negócio: Opcional - verificar duplicidade por email
        // const existingClient = await clientRepository.findOneBy({ email: clientData.email });
        // if (existingClient) {
        //     throw new Error('Já existe um cliente com este email.');
        // }

        // 3. Criação no banco
        const client = clientRepository.create(clientInstance); // Use a instância validada/transformada
        return await clientRepository.save(client);
    }

    /**
     * Busca um cliente pelo ID.
     * @param id ID do cliente (UUID).
     * @returns O cliente encontrado ou null.
     */
    async findById(id: string): Promise<Client | null> {
        return await clientRepository.findOneBy({ id });
    }

    /**
     * Lista todos os clientes.
     * @returns Array de clientes.
     */
    async findAll(): Promise<Client[]> {
        return await clientRepository.find();
    }

    /**
     * Atualiza os dados de um cliente existente.
     * @param id ID do cliente a ser atualizado.
     * @param updateData Dados para atualização.
     * @returns O cliente atualizado ou null se não encontrado.
     * @throws Error se a validação falhar ou se o cliente não existir.
     */
    async update(id: string, updateData: UpdateClientDTO): Promise<Client | null> {
         // 1. Validar se o cliente existe
         const clientToUpdate = await clientRepository.findOneBy({ id });
         if (!clientToUpdate) {
             return null; // Ou lançar erro "Cliente não encontrado"
         }

        // 2. Validação usando class-validator/transformer
        const updateInstance = plainToInstance(UpdateClientDTO, updateData);
        const errors = await validate(updateInstance);

        if (errors.length > 0) {
            console.error('Validation failed: ', errors);
            throw new Error('Dados de atualização do cliente inválidos.');
        }

        // 3. Aplicar atualizações e salvar
        clientRepository.merge(clientToUpdate, updateInstance); // Use a instância validada/transformada
        return await clientRepository.save(clientToUpdate);
    }

    /**
     * Remove um cliente pelo ID.
     * @param id ID do cliente a ser removido.
     * @returns True se removido com sucesso, false se não encontrado.
     */
    async delete(id: string): Promise<boolean> {
        const result = await clientRepository.delete(id);
        //return result.affected !== undefined && result.affected > 0;
        return !!result.affected && result.affected > 0;
    }
}

// Exportar uma instância padrão para facilitar uso nos controllers
export const clientService = new ClientService();