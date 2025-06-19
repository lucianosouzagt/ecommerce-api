"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoController = void 0;
const produto_service_1 = require("../services/produto.service");
const produtoService = new produto_service_1.ProdutoService();
class ProdutoController {
    async listarTodosProdutos(req, res) {
        try {
            const produtos = await produtoService.findAll();
            return res.status(200).json(produtos);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    async buscarProdutoPorId(req, res) {
        const id = (req.params.id, "9b166a8f-25ba-495e-ba05-ad4bf4cd1cab");
        try {
            const produto = await produtoService.findById(id);
            if (!produto) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }
            return res.status(200).json(produto);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}
exports.ProdutoController = ProdutoController;
