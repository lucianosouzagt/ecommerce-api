// src/controllers/ProductController.ts
import { Request, Response } from 'express';
import { productService } from '../services';
import { CreateProductDTO } from '../dtos/products/CreateProductDTO';
import { UpdateProductDTO } from '../dtos/products/UpdateProductDTO';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class ProductController {

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const productData: CreateProductDTO = req.body;

            const productDto = plainToInstance(CreateProductDTO, productData);
            const errors = await validate(productDto);
            if (errors.length > 0) {
                return res.status(400).json({ message: 'Dados de entrada inválidos', errors });
            }

            const product = await productService.create(productData);
            return res.status(201).json(product);
        } catch (error: any) {
            console.error('Erro no ProductController.create:', error);
             if (error.message.includes('Já existe')) {
                 return res.status(409).json({ message: error.message }); // 409 Conflict
            }
             if (error.message.includes('inválidos')) {
                 return res.status(400).json({ message: error.message }); // 400 Bad Request
            }
            return res.status(500).json({ message: 'Erro interno ao criar produto' });
        }
    }

    async findById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const product = await productService.findById(id);

            if (!product) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }

            return res.status(200).json(product);
        } catch (error) {
            console.error('Erro no ProductController.findById:', error);
            return res.status(500).json({ message: 'Erro interno ao buscar produto' });
        }
    }

    async findAll(req: Request, res: Response): Promise<Response> {
        try {
            const products = await productService.findAll();
            return res.status(200).json(products);
        } catch (error) {
            console.error('Erro no ProductController.findAll:', error);
            return res.status(500).json({ message: 'Erro interno ao listar produtos' });
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const updateData: UpdateProductDTO = req.body;

            const productDto = plainToInstance(UpdateProductDTO, updateData);
            const errors = await validate(productDto);
            if (errors.length > 0) {
                return res.status(400).json({ message: 'Dados de atualização inválidos', errors });
            }

            const updatedProduct = await productService.update(id, updateData);

            if (!updatedProduct) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }

            return res.status(200).json(updatedProduct);
        } catch (error: any) {
            console.error('Erro no ProductController.update:', error);
             if (error.message.includes('inválidos')) {
                 return res.status(400).json({ message: error.message }); // 400 Bad Request
            }
            return res.status(500).json({ message: 'Erro interno ao atualizar produto' });
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
             // Lógica de negócio: Verificar se o produto pode ser excluído (ex: não ter estoque, não estar em pedidos ativos)
             // Essa verificação deve estar no Service, o controller apenas chama.
            const deleted = await productService.delete(id);

            if (!deleted) {
                return res.status(404).json({ message: 'Produto não encontrado ou não pode ser excluído' }); // Pode ser 404 ou 409 dependendo do motivo no service
            }

            return res.status(204).send();
        } catch (error: any) {
            console.error('Erro no ProductController.delete:', error);
             if (error.message.includes('não pode ser excluído')) { // Exemplo de erro vindo do service
                 return res.status(409).json({ message: error.message });
             }
            return res.status(500).json({ message: 'Erro interno ao deletar produto' });
        }
    }
}