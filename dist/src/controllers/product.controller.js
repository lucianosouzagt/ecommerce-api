"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const Product_service_1 = require("../services/Product.service");
const productService = new Product_service_1.ProductService();
class ProductController {
    async listarTodosProdutos(req, res, next) {
        try {
            const produtos = await productService.findAll();
            res.status(200).json(produtos);
        }
        catch (error) {
            next(error);
        }
    }
    async buscarProdutoPorId(req, res, next) {
        const id = (req.params.id, "9b166a8f-25ba-495e-ba05-ad4bf4cd1cab");
        try {
            const produto = await productService.findById(id);
            if (!produto) {
                res.status(404).json({ message: 'Produto não encontrado' });
            }
            res.status(200).json(produto);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProductController = ProductController;
