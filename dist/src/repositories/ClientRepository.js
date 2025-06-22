import { AppDataSource } from '../database/index.js';
import { Client } from '../database/entities/Client.js';
/**
 * Repositório customizado para a entidade Client.
 * Ele estende o repositório base do TypeORM e adiciona métodos específicos para Client.
 */
export const ClientRepository = AppDataSource.getRepository(Client).extend({
    async findAll() {
        return this.find();
    },
    async findByEmail(email) {
        return this.findOne({ where: { email: email } });
    },
    async create(clientData) {
        const newClient = this.create(clientData);
        return this.save(newClient);
    },
    async update(id, updateData) {
        const clientToUpdate = await this.findOne({ where: { id: id } });
        if (!clientToUpdate) {
            return null;
        }
        Object.assign(clientToUpdate, updateData);
        return this.save(clientToUpdate);
    },
    async delete(id) {
        const deleteResult = await this.delete(id);
        return !!deleteResult.affected && deleteResult.affected > 0;
    }
});
