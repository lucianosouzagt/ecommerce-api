"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const services_1 = require("../services");
const CreateUserDTO_1 = require("../dtos/users/CreateUserDTO");
const UpdateUserDTO_1 = require("../dtos/users/UpdateUserDTO");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class UserController {
    async create(req, res) {
        try {
            const userData = req.body;
            const userDto = (0, class_transformer_1.plainToInstance)(CreateUserDTO_1.CreateUserDTO, userData);
            const errors = await (0, class_validator_1.validate)(userDto);
            if (errors.length > 0) {
                return res.status(400).json({ message: 'Dados de entrada inválidos', errors });
            }
            const user = await services_1.userService.create(userData);
            // Remover a senha ANTES de enviar a resposta
            // Embora o service já retorne sem senha na maioria dos finders,
            // garantir aqui para o método create.
            // delete user.password; // Pode causar erro se 'password' for privado/protegido na entidade.
            // Melhor abordar isso com DTOs de resposta ou selecionar campos específicos.
            const { password, ...userWithoutPassword } = user; // Copia tudo exceto password
            return res.status(201).json(userWithoutPassword); // 201 Created
        }
        catch (error) {
            console.error('Erro no UserController.create:', error);
            if (error.message.includes('Já existe')) {
                return res.status(409).json({ message: error.message }); // 409 Conflict
            }
            if (error.message.includes('inválidos')) {
                return res.status(400).json({ message: error.message }); // 400 Bad Request
            }
            return res.status(500).json({ message: 'Erro interno ao criar usuário' });
        }
    }
    async findById(req, res) {
        try {
            const { id } = req.params;
            const user = await services_1.userService.findById(id); // O service já deve retornar sem senha
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
            return res.status(200).json(user); // Retorna o objeto User (sem senha pelo findById do service)
        }
        catch (error) {
            console.error('Erro no UserController.findById:', error);
            return res.status(500).json({ message: 'Erro interno ao buscar usuário' });
        }
    }
    async findAll(req, res) {
        try {
            const users = await services_1.userService.findAll(); // O service já deve retornar sem senha
            return res.status(200).json(users); // Retorna array de User (sem senha pelo findAll do service)
        }
        catch (error) {
            console.error('Erro no UserController.findAll:', error);
            return res.status(500).json({ message: 'Erro interno ao listar usuários' });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const userDto = (0, class_transformer_1.plainToInstance)(UpdateUserDTO_1.UpdateUserDTO, updateData);
            const errors = await (0, class_validator_1.validate)(userDto);
            if (errors.length > 0) {
                return res.status(400).json({ message: 'Dados de atualização inválidos', errors });
            }
            // Lógica de autorização: O usuário logado pode atualizar ESTE usuário? É admin?
            // Assumindo que isso seria tratado por um middleware ANTES de chegar aqui.
            const updatedUser = await services_1.userService.update(id, updateData); // Service lida com hash de senha e validações
            if (!updatedUser) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
            // Remover a senha ANTES de enviar a resposta
            const { password, ...userWithoutPassword } = updatedUser;
            return res.status(200).json(userWithoutPassword); // 200 OK
        }
        catch (error) {
            console.error('Erro no UserController.update:', error);
            if (error.message.includes('inválidos')) {
                return res.status(400).json({ message: error.message }); // 400 Bad Request
            }
            // Outros erros de negócio podem vir do service (ex: tentar mudar email para um email já existente)
            if (error.message.includes('Já existe')) {
                return res.status(409).json({ message: error.message }); // 409 Conflict
            }
            return res.status(500).json({ message: 'Erro interno ao atualizar usuário' });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            // Lógica de autorização: O usuário logado pode deletar ESTE usuário? É admin?
            // Assumindo que isso seria tratado por um middleware.
            const deleted = await services_1.userService.delete(id); // Service lida com regras de negócio (ex: não deletar admin)
            if (!deleted) {
                // Pode ser 404 se não encontrado, ou 409 se regras de negócio impedirem a exclusão
                const user = await services_1.userService.findById(id); // Verificar se existe para decidir entre 404 e 409
                if (!user) {
                    return res.status(404).json({ message: 'Usuário não encontrado' });
                }
                else {
                    // Se existe mas não foi deletado, o service deve ter lançado um erro com a razão
                    // Capturar esse erro específico no catch abaixo seria melhor
                    return res.status(409).json({ message: 'Não foi possível deletar o usuário' });
                }
            }
            return res.status(204).send(); // 204 No Content
        }
        catch (error) {
            console.error('Erro no UserController.delete:', error);
            if (error.message.includes('Não é possível excluir')) { // Exemplo de erro do service
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno ao deletar usuário' });
        }
    }
}
exports.UserController = UserController;
