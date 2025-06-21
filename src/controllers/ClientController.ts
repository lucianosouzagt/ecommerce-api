// src/controllers/ClientController.ts
import { Request, Response } from 'express';
// Importe a CLASSE do serviço
import { ClientService } from '../services'; 

export class ClientController {
    private clientService: ClientService;

    // O construtor do controller agora aceita uma instância do ClientService
    constructor(clientService?: ClientService) { 
        this.clientService = clientService || new ClientService(); 
    }

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const clientData = req.body;
            const newClient = await this.clientService.create(clientData);
            return res.status(201).json(newClient);
        } catch (error: any) {
            if (error.message.includes('Dados do cliente inválidos') || error.message.includes('Já existe')) {
                return res.status(400).json({ message: error.message });
            }
            console.error('Erro ao criar cliente:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }

    async findById(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const client = await this.clientService.findById(id);
            if (!client) {
                return res.status(404).json({ message: 'Cliente não encontrado.' });
            }
            return res.status(200).json(client);
        } catch (error: any) {
            console.error('Erro ao buscar cliente por ID:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }

    async findAll(req: Request, res: Response): Promise<Response> {
        try {
            const clients = await this.clientService.findAll();
            return res.status(200).json(clients);
        } catch (error: any) {
            console.error('Erro ao buscar todos os clientes:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }

    async update(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const clientData = req.body;
            const updatedClient = await this.clientService.update(id, clientData);
            if (!updatedClient) {
                return res.status(404).json({ message: 'Cliente não encontrado para atualização.' });
            }
            return res.status(200).json(updatedClient);
        } catch (error: any) {
            console.error('Erro ao atualizar cliente:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }

    async delete(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const success = await this.clientService.delete(id);
            if (!success) {
                // Supondo que delete retorna false para não encontrado ou não deletável
                return res.status(404).json({ message: 'Cliente não encontrado para exclusão.' });
            }
            return res.status(204).send(); // 204 No Content para exclusão bem-sucedida
        } catch (error: any) {
            console.error('Erro ao deletar cliente:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
}