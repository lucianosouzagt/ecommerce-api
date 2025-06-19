// src/database/repositories/UserRepository.ts
import { Repository } from 'typeorm';
import { User } from '../database/entities/User'; // Ajuste o caminho conforme sua estrutura
import AppDataSource from '../database'; // Ajuste o caminho conforme sua estrutura

// Exporta a instância do repositório diretamente
export const UserRepository: Repository<User> = AppDataSource.getRepository(User);

// Podemos adicionar métodos customizados aqui se necessário
// Exemplo: buscar usuário por email (se AppDataSource já estiver inicializado)

export const UserRepositoryWithCustomMethods = UserRepository.extend({
    findByEmail(email: string) {
        return this.findOne({ where: { email } });
    }
});
