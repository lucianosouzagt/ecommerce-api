import { Request, Response } from 'express';
import { ProductService } from '../services';

export class ProductController {
    private productService: ProductService;

    constructor(productService?: ProductService) {
        this.productService = productService || new ProductService();
    }

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const product = await this.productService.create(req.body);
            return res.status(201).json(product);
        } catch (error: any) {
            if (error.message.includes('inválido')) {
                return res.status(400).json({ message: error.message });
            }
            console.error('Erro ao criar produto:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }

    async findById(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {
            const product = await this.productService.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Produto não encontrado.' });
            }
            return res.status(200).json(product);
        } catch (error: any) {
            console.error('Erro ao buscar produto:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }

    async findAll(req: Request, res: Response): Promise<Response> {
        try {
            const products = await this.productService.findAll();
            return res.status(200).json(products);
        } catch (error: any) {
            console.error('Erro ao listar produtos:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }

    async update(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {
            const updated = await this.productService.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ message: 'Produto não encontrado para atualização.' });
            }
            return res.status(200).json(updated);
        } catch (error: any) {
            console.error('Erro ao atualizar produto:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }

    async delete(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {
            const success = await this.productService.delete(req.params.id);
            if (!success) {
                return res.status(404).json({ message: 'Produto não encontrado para exclusão.' });
            }
            return res.status(204).send();
        } catch (error: any) {
            console.error('Erro ao deletar produto:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
}
