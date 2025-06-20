// src/services/ProductService.ts
import { Product } from '../database/entities/Product';
import { ProductRepository } from '../repositories/ProductRepository';
import { validate } from 'class-validator'; // TypeORM com class-validator para validação

// Classe de Serviço para gerenciar a lógica de negócio relacionada a Produtos
export class ProductService {

    // Injeção de dependência (opcional, mas boa prática) ou acesso direto ao repositório exportado
    // private productRepository = AppDataSource.getRepository(Product); // Se não usasse o export constante
    private productRepository = ProductRepository; // Usando a instância exportada

    // Método para listar todos os produtos
    async findAll(): Promise<Product[]> {
        // Aqui poderíamos adicionar lógica de paginação, filtros, etc.
        const products = await this.productRepository.find();
        return products;
    }

    // Método para buscar um produto por ID
    async findById(id: string): Promise<Product | null> {
        // Regra de negócio: garantir que o ID é válido (UUID, se aplicável)
        // Embora o TypeORM possa validar UUIDs na consulta, validações de formato podem vir antes.
        // Se o ID não for encontrado, o findOneById retorna null.
        const product = await this.productRepository.findOne({ where: { id } });
        return product;
    }

    // Método para criar um novo produto
    async create(productData: Partial<Product>): Promise<Product> {
        // 1. Regra de Negócio/Validação: Validar os dados de entrada
        const newProduct = this.productRepository.create(productData); // Cria uma instância da entidade
        const errors = await validate(newProduct); // Usa class-validator para validar
        if (errors.length > 0) {
             // Lançar um erro customizado ou uma exceção com detalhes dos erros de validação
             // Ex: throw new ValidationException(errors);
             console.error("Erros de validação ao criar produto:", errors);
             // Para simplificar por enquanto, vamos apenas lançar um erro genérico ou processar de forma básica:
             const errorMessage = errors.map(err => Object.values(err.constraints || {})).join(', ');
             throw new Error(`Validation failed: ${errorMessage}`);
        }

        // 2. Regra de Negócio: Verificar se o produto já existe (se necessário, ex: por nome único)
        // const existingProduct = await this.productRepository.findOne({ where: { name: newProduct.name } });
        // if (existingProduct) {
        //     throw new Error(`Product with name "${newProduct.name}" already exists.`);
        // }

        // 3. Persistir no banco de dados usando o repositório
        const savedProduct = await this.productRepository.save(newProduct);
        return savedProduct;
    }

    // Método para atualizar um produto existente
    async update(id: string, updateData: Partial<Product>): Promise<Product | null> {
        // 1. Regra de Negócio: Buscar o produto existente
        const productToUpdate = await this.productRepository.findOne({ where: { id } });
        if (!productToUpdate) {
            return null; // Produto não encontrado
        }

        // 2. Regra de Negócio/Validação: Aplicar as atualizações e validar
        this.productRepository.merge(productToUpdate, updateData); // Mescla os dados de atualização na entidade
        const errors = await validate(productToUpdate); // Valida a entidade mesclada
         if (errors.length > 0) {
             console.error(`Erros de validação ao atualizar produto ${id}:`, errors);
             const errorMessage = errors.map(err => Object.values(err.constraints || {})).join(', ');
             throw new Error(`Validation failed during update: ${errorMessage}`);
        }

        // 3. Persistir as alterações
        const updatedProduct = await this.productRepository.save(productToUpdate);
        return updatedProduct;
    }

    // Método para remover um produto
    async delete(id: string): Promise<boolean> {
        // 1. Regra de Negócio: Verificar dependências (Ex: não pode deletar produto com pedidos ativos)
        // const hasActiveOrders = await this.orderItemRepository.count({ where: { product_id: id, order: { status: Not('Completed') } } }); // Exemplo complexo
        // if (hasActiveOrders > 0) {
        //    throw new Error('Cannot delete product with active orders.');
        // }

        // 2. Remover o produto usando o repositório
        // O TypeORM remove retorna um DeleteResult, que indica quantos registros foram afetados
        const deleteResult = await this.productRepository.delete(id);

        // Retorna true se pelo menos um registro foi afetado, false caso contrário
        return deleteResult.affected !== undefined && deleteResult.affected! > 0;
    }

     // Método para contar produtos (exemplo simples)
     async count(): Promise<number> {
         const count = await this.productRepository.count();
         return count;
     }
}