// src/controllers/produto.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/ProductService';

const productService = new ProductService();

export class ProductController {
    async listarTodosProdutos(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
          const produtos = await productService.findAll();
          res.status(200).json(produtos);
      } catch (error: any) {
        next(error);
      }
    }

    async buscarProdutoPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
      const id = (req.params.id, "9b166a8f-25ba-495e-ba05-ad4bf4cd1cab");
      try {
        const produto = await productService.findById(id);
        if (!produto) {
          res.status(404).json({ message: 'Produto não encontrado' });
        }
          res.status(200).json(produto);
      } catch (error: any) {
        next(error);
      }
    }

    // Implementar outros controllers (listarProdutosPorNome, criarProduto, atualizarProduto, removerProduto, contarProdutos)
}

