"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const database_1 = require("../database");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const User_1 = require("../database/entities/User");
const CreateUserDTO_1 = require("../dtos/users/CreateUserDTO");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository || database_1.AppDataSource.getRepository(User_1.User);
    }
    async create(userData) {
        const userDto = (0, class_transformer_1.plainToInstance)(CreateUserDTO_1.CreateUserDTO, userData);
        const errors = await (0, class_validator_1.validate)(userDto);
        if (errors.length > 0) {
            const errorMessages = errors.map(err => Object.values(err.constraints || {})).flat();
            throw new Error(`Dados do usuário inválidos: ${errorMessages.join(', ')}`);
        }
        const existingUser = await this.userRepository.findOneBy({ email: userData.email });
        if (existingUser) {
            throw new Error('Já existe um usuário com este email.');
        }
        const user = this.userRepository.create(userData);
        return await this.userRepository.save(user);
    }
    async findById(id) {
        return this.userRepository.findOneBy({ id });
    }
    async findAll() {
        return this.userRepository.find();
    }
    async update(id, userData) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user)
            return null;
        this.userRepository.merge(user, userData);
        return await this.userRepository.save(user);
    }
    async delete(id) {
        const result = await this.userRepository.delete(id);
        return !!result.affected && result.affected > 0;
    }
}
exports.UserService = UserService;
// Instância padrão exportada
exports.userService = new UserService();
