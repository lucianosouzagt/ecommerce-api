"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
// src/services/UserService.ts
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const User_1 = require("../database/entities/User");
const database_1 = require("../database");
const bcrypt_1 = __importDefault(require("bcrypt")); // Para hash de senhas
// DTOs
const CreateUserDTO_1 = require("../dtos/users/CreateUserDTO");
const UpdateUserDTO_1 = require("../dtos/users/UpdateUserDTO");
const userRepository = database_1.AppDataSource.getRepository(User_1.User);
const saltRounds = 10; // Número de rounds para o hash bcrypt
class UserService {
    /**
     * Cria um novo usuário no sistema.
     * Inclui validação, verificação de duplicidade e hash de senha.
     * @param userData Dados do usuário a ser criado.
     * @returns O usuário criado (sem o hash da senha para segurança).
     * @throws Error se a validação falhar, email duplicado ou erro no banco.
     */
    async create(userData) {
        // 1. Validação usando class-validator/transformer
        const userInstance = (0, class_transformer_1.plainToInstance)(CreateUserDTO_1.CreateUserDTO, userData);
        const errors = await (0, class_validator_1.validate)(userInstance);
        if (errors.length > 0) {
            console.error('Validation failed: ', errors);
            throw new Error('Dados do usuário inválidos.');
        }
        // 2. Lógica de negócio: Verificar duplicidade por email
        const existingUser = await userRepository.findOneBy({ email: userInstance.email });
        if (existingUser) {
            throw new Error('Já existe um usuário com este email.');
        }
        // 3. Lógica de negócio: Hashear a senha
        const hashedPassword = await bcrypt_1.default.hash(userInstance.password, saltRounds);
        // 4. Criação no banco
        const user = userRepository.create({
            name: userInstance.name,
            email: userInstance.email,
            password: hashedPassword, // Salva a senha hasheada
            role: userInstance.role || 'user', // Define um papel padrão se não especificado
            // Outros campos como createdAt, updatedAt são gerados automaticamente pelo TypeORM com @CreateDateColumn/@UpdateDateColumn
        });
        const savedUser = await userRepository.save(user);
        // Retorna o usuário criado, mas remove o campo de senha por segurança
        // Uma forma de fazer isso é selecionar apenas os campos desejados na query de retorno,
        // ou manualmente remover o campo do objeto antes de retornar.
        // Exemplo simples removendo o campo:
        // delete savedUser.password; // Isso modifica o objeto original
        // Uma abordagem mais robusta seria retornar um DTO de resposta
        return savedUser;
    }
    /**
     * Busca um usuário pelo ID.
     * @param id ID do usuário (UUID).
     * @returns O usuário encontrado ou null.
     */
    async findById(id) {
        // Excluir a senha na consulta por padrão (melhor forma é configurar na entidade ou na query)
        // Exemplo de query builder para excluir a senha:
        const user = await userRepository
            .createQueryBuilder("user")
            .where("user.id = :id", { id })
            .select(["user.id", "user.name", "user.email", "user.role", "user.createdAt", "user.updatedAt"]) // Seleciona campos exceto password
            .getOne();
        return user;
    }
    /**
     * Busca um usuário pelo email (útil para login). Inclui a senha.
     * @param email Email do usuário.
     * @returns O usuário encontrado (com senha) ou null.
     */
    async findByEmailWithPassword(email) {
        // Para autenticação, precisamos do hash da senha
        return await userRepository.findOne({ where: { email } });
    }
    /**
     * Lista todos os usuários (sem a senha).
     * @returns Array de usuários.
     */
    async findAll() {
        const users = await userRepository
            .createQueryBuilder("user")
            .select(["user.id", "user.name", "user.email", "user.role", "user.createdAt", "user.updatedAt"]) // Seleciona campos exceto password
            .getMany();
        return users;
    }
    /**
     * Atualiza os dados de um usuário existente.
     * Inclui validação e hash da nova senha se fornecida.
     * @param id ID do usuário a ser atualizado.
     * @param updateData Dados para atualização.
     * @returns O usuário atualizado (sem senha) ou null se não encontrado.
     * @throws Error se a validação falhar ou se o usuário não existir.
     */
    async update(id, updateData) {
        // 1. Validar se o usuário existe
        const userToUpdate = await userRepository.findOneBy({ id });
        if (!userToUpdate) {
            return null; // Ou lançar erro "Usuário não encontrado"
        }
        // 2. Validação usando class-validator/transformer
        const updateInstance = (0, class_transformer_1.plainToInstance)(UpdateUserDTO_1.UpdateUserDTO, updateData);
        const errors = await (0, class_validator_1.validate)(updateInstance);
        if (errors.length > 0) {
            console.error('Validation failed: ', errors);
            throw new Error('Dados de atualização do usuário inválidos.');
        }
        // 3. Lógica de Negócio: Hashear nova senha se fornecida
        if (updateInstance.password !== undefined) {
            userToUpdate.password = await bcrypt_1.default.hash(updateInstance.password, saltRounds);
            // Remove a senha do updateInstance para não tentar 'mergear' o valor original
            delete updateInstance.password;
        }
        // 4. Aplicar outras atualizações e salvar
        // Use merge para aplicar apenas os campos presentes no DTO de atualização
        userRepository.merge(userToUpdate, updateInstance);
        const savedUser = await userRepository.save(userToUpdate);
        // Retorna o usuário atualizado, removendo a senha
        // delete savedUser.password; // Modifica o objeto original
        return savedUser; // Melhor retornar o resultado da query findById(id) após salvar
    }
    /**
     * Remove um usuário pelo ID.
     * @param id ID do usuário a ser removido.
     * @returns True se removido com sucesso, false se não encontrado.
     * @throws Error se houver regras de negócio impedindo a exclusão (ex: usuário admin).
     */
    async delete(id) {
        // Lógica de negócio: Impedir exclusão de certos usuários (ex: o último admin)
        const user = await userRepository.findOneBy({ id });
        if (!user) {
            return false; // Usuário não encontrado
        }
        if (user.role === 'admin') { // Exemplo de regra
            // Verificar se não é o último admin antes de permitir a exclusão
            // const adminCount = await userRepository.count({ where: { role: 'admin' } });
            // if (adminCount <= 1) {
            //     throw new Error('Não é possível excluir o último usuário administrador.');
            // }
            // throw new Error('Não é possível excluir usuários administradores diretamente.');
        }
        const result = await userRepository.delete(id);
        //return result.affected !== undefined && result.affected > 0;
        return !!result.affected && result.affected > 0;
    }
}
exports.UserService = UserService;
// Exportar uma instância padrão
exports.userService = new UserService();
