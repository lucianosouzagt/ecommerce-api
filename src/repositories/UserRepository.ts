// src/database/repositories/UserRepository.ts
import { Repository } from 'typeorm';
import { AppDataSource } from '../database/index.js';
import { User } from '../database/entities/User.js';


// Definir a interface para os métodos customizados
interface ProductRepositoryCustom extends Repository<User> {
    findActiveProducts(): Promise<User[]>;
    // Adicione outras declarações de método aqui
}

// Exporta a instância do repositório diretamente
export const UserRepository: Repository<User> = AppDataSource.getRepository(User);

// Podemos adicionar métodos customizados aqui se necessário
// Exemplo: buscar usuário por email (se AppDataSource já estiver inicializado)

export const UserRepositoryWithCustomMethods = UserRepository.extend({
    findByEmail(email: string) {
        return this.findOne({ where: { email } });
    }
});
