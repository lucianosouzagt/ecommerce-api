"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const services_1 = require("../services");
const CreateProductDTO_1 = require("../dtos/products/CreateProductDTO");
const UpdateProductDTO_1 = require("../dtos/products/UpdateProductDTO");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ProductController {
    async create(req, res) {
        try {
            const productData = req.body;
            const productDto = (0, class_transformer_1.plainToInstance)(CreateProductDTO_1.CreateProductDTO, productData);
            const errors = await (0, class_validator_1.validate)(productDto);
            if (errors.length > 0) {
                return res.status(400).json({ message: 'Dados de entrada inválidos', errors });
            }
            const product = await services_1.productService.create(productData);
            return res.status(201).json(product);
        }
        catch (error) {
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
    async findById(req, res) {
        try {
            const { id } = req.params;
            const product = await services_1.productService.findById(id);
            if (!product) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }
            return res.status(200).json(product);
        }
        catch (error) {
            console.error('Erro no ProductController.findById:', error);
            return res.status(500).json({ message: 'Erro interno ao buscar produto' });
        }
    }
    async findAll(req, res) {
        try {
            const products = await services_1.productService.findAll();
            return res.status(200).json(products);
        }
        catch (error) {
            console.error('Erro no ProductController.findAll:', error);
            return res.status(500).json({ message: 'Erro interno ao listar produtos' });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const productDto = (0, class_transformer_1.plainToInstance)(UpdateProductDTO_1.UpdateProductDTO, updateData);
            const errors = await (0, class_validator_1.validate)(productDto);
            if (errors.length > 0) {
                return res.status(400).json({ message: 'Dados de atualização inválidos', errors });
            }
            const updatedProduct = await services_1.productService.update(id, updateData);
            if (!updatedProduct) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }
            return res.status(200).json(updatedProduct);
        }
        catch (error) {
            console.error('Erro no ProductController.update:', error);
            if (error.message.includes('inválidos')) {
                return res.status(400).json({ message: error.message }); // 400 Bad Request
            }
            return res.status(500).json({ message: 'Erro interno ao atualizar produto' });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            // Lógica de negócio: Verificar se o produto pode ser excluído (ex: não ter estoque, não estar em pedidos ativos)
            // Essa verificação deve estar no Service, o controller apenas chama.
            const deleted = await services_1.productService.delete(id);
            if (!deleted) {
                return res.status(404).json({ message: 'Produto não encontrado ou não pode ser excluído' }); // Pode ser 404 ou 409 dependendo do motivo no service
            }
            return res.status(204).send();
        }
        catch (error) {
            console.error('Erro no ProductController.delete:', error);
            if (error.message.includes('não pode ser excluído')) { // Exemplo de erro vindo do service
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno ao deletar produto' });
        }
    }
}
exports.ProductController = ProductController;
