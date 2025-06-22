"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const services_1 = require("../services");
class UserController {
    constructor(userService) {
        this.userService = userService || new services_1.UserService();
    }
    async create(req, res) {
        try {
            const userData = req.body;
            const newUser = await this.userService.create(userData);
            return res.status(201).json(newUser);
        }
        catch (error) {
            if (error.message.includes('inválido') || error.message.includes('Já existe')) {
                return res.status(400).json({ message: error.message });
            }
            console.error('Erro ao criar usuário:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
    async findById(req, res) {
        try {
            const { id } = req.params;
            const user = await this.userService.findById(id);
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }
            return res.status(200).json(user);
        }
        catch (error) {
            console.error('Erro ao buscar usuário por ID:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
    async findAll(req, res) {
        try {
            const users = await this.userService.findAll();
            return res.status(200).json(users);
        }
        catch (error) {
            console.error('Erro ao buscar todos os usuários:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const userData = req.body;
            const updatedUser = await this.userService.update(id, userData);
            if (!updatedUser) {
                return res.status(404).json({ message: 'Usuário não encontrado para atualização.' });
            }
            return res.status(200).json(updatedUser);
        }
        catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const success = await this.userService.delete(id);
            if (!success) {
                return res.status(404).json({ message: 'Usuário não encontrado para exclusão.' });
            }
            return res.status(204).send();
        }
        catch (error) {
            console.error('Erro ao deletar usuário:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
}
exports.UserController = UserController;
