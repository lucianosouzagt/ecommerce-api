// src/controllers/UserController.ts
import { Request, Response } from 'express';
import { userService } from '../services';
import { CreateUserDTO } from '../dtos/users/CreateUserDTO';
import { UpdateUserDTO } from '../dtos/users/UpdateUserDTO';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class UserController {

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const userData: CreateUserDTO = req.body;

            const userDto = plainToInstance(CreateUserDTO, userData);
            const errors = await validate(userDto);
            if (errors.length > 0) {
                return res.status(400).json({ message: 'Dados de entrada inválidos', errors });
            }

            const user = await userService.create(userData);
             // Remover a senha ANTES de enviar a resposta
             // Embora o service já retorne sem senha na maioria dos finders,
             // garantir aqui para o método create.
             // delete user.password; // Pode causar erro se 'password' for privado/protegido na entidade.
             // Melhor abordar isso com DTOs de resposta ou selecionar campos específicos.
             const { password, ...userWithoutPassword } = user; // Copia tudo exceto password
            return res.status(201).json(userWithoutPassword); // 201 Created
        } catch (error: any) {
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

    async findById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const user = await userService.findById(id); // O service já deve retornar sem senha

            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            return res.status(200).json(user); // Retorna o objeto User (sem senha pelo findById do service)
        } catch (error) {
            console.error('Erro no UserController.findById:', error);
            return res.status(500).json({ message: 'Erro interno ao buscar usuário' });
        }
    }

    async findAll(req: Request, res: Response): Promise<Response> {
        try {
            const users = await userService.findAll(); // O service já deve retornar sem senha
            return res.status(200).json(users); // Retorna array de User (sem senha pelo findAll do service)
        } catch (error) {
            console.error('Erro no UserController.findAll:', error);
            return res.status(500).json({ message: 'Erro interno ao listar usuários' });
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const updateData: UpdateUserDTO = req.body;

            const userDto = plainToInstance(UpdateUserDTO, updateData);
            const errors = await validate(userDto);
            if (errors.length > 0) {
                return res.status(400).json({ message: 'Dados de atualização inválidos', errors });
            }

             // Lógica de autorização: O usuário logado pode atualizar ESTE usuário? É admin?
             // Assumindo que isso seria tratado por um middleware ANTES de chegar aqui.

            const updatedUser = await userService.update(id, updateData); // Service lida com hash de senha e validações

            if (!updatedUser) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

             // Remover a senha ANTES de enviar a resposta
             const { password, ...userWithoutPassword } = updatedUser;
            return res.status(200).json(userWithoutPassword); // 200 OK
        } catch (error: any) {
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

    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
             // Lógica de autorização: O usuário logado pode deletar ESTE usuário? É admin?
             // Assumindo que isso seria tratado por um middleware.

            const deleted = await userService.delete(id); // Service lida com regras de negócio (ex: não deletar admin)

            if (!deleted) {
                 // Pode ser 404 se não encontrado, ou 409 se regras de negócio impedirem a exclusão
                 const user = await userService.findById(id); // Verificar se existe para decidir entre 404 e 409
                 if (!user) {
                     return res.status(404).json({ message: 'Usuário não encontrado' });
                 } else {
                     // Se existe mas não foi deletado, o service deve ter lançado um erro com a razão
                     // Capturar esse erro específico no catch abaixo seria melhor
                     return res.status(409).json({ message: 'Não foi possível deletar o usuário' });
                 }
            }

            return res.status(204).send(); // 204 No Content
        } catch (error: any) {
            console.error('Erro no UserController.delete:', error);
             if (error.message.includes('Não é possível excluir')) { // Exemplo de erro do service
                 return res.status(409).json({ message: error.message });
             }
            return res.status(500).json({ message: 'Erro interno ao deletar usuário' });
        }
    }
}