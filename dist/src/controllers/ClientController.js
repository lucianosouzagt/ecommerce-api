"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
// Importe a CLASSE do serviço
const services_1 = require("../services");
class ClientController {
    // O construtor do controller agora aceita uma instância do ClientService
    constructor(clientService) {
        this.clientService = clientService || new services_1.ClientService();
    }
    async create(req, res) {
        try {
            const clientData = req.body;
            const newClient = await this.clientService.create(clientData);
            return res.status(201).json(newClient);
        }
        catch (error) {
            if (error.message.includes('Dados do cliente inválidos') || error.message.includes('Já existe')) {
                return res.status(400).json({ message: error.message });
            }
            console.error('Erro ao criar cliente:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
    async findById(req, res) {
        try {
            const { id } = req.params;
            const client = await this.clientService.findById(id);
            if (!client) {
                return res.status(404).json({ message: 'Cliente não encontrado.' });
            }
            return res.status(200).json(client);
        }
        catch (error) {
            console.error('Erro ao buscar cliente por ID:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
    async findAll(req, res) {
        try {
            const clients = await this.clientService.findAll();
            return res.status(200).json(clients);
        }
        catch (error) {
            console.error('Erro ao buscar todos os clientes:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const clientData = req.body;
            const updatedClient = await this.clientService.update(id, clientData);
            if (!updatedClient) {
                return res.status(404).json({ message: 'Cliente não encontrado para atualização.' });
            }
            return res.status(200).json(updatedClient);
        }
        catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const success = await this.clientService.delete(id);
            if (!success) {
                // Supondo que delete retorna false para não encontrado ou não deletável
                return res.status(404).json({ message: 'Cliente não encontrado para exclusão.' });
            }
            return res.status(204).send(); // 204 No Content para exclusão bem-sucedida
        }
        catch (error) {
            console.error('Erro ao deletar cliente:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
}
exports.ClientController = ClientController;
