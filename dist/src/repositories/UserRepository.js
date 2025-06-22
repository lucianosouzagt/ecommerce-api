import { AppDataSource } from '../database/index.js';
import { User } from '../database/entities/User.js';
// Exporta a instância do repositório diretamente
export const UserRepository = AppDataSource.getRepository(User);
// Podemos adicionar métodos customizados aqui se necessário
// Exemplo: buscar usuário por email (se AppDataSource já estiver inicializado)
export const UserRepositoryWithCustomMethods = UserRepository.extend({
    findByEmail(email) {
        return this.findOne({ where: { email } });
    }
});
