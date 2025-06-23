// src/database/repositories/ProductRepository.ts
import { DeleteResult } from 'typeorm'; 
import { AppDataSource } from '../database/index.js';
import { Product } from '../database/entities/Product.js';

/**
 * Interface que define os métodos customizados que serão adicionados ao ProductRepository.
 */
interface ProductRepositoryCustom {
    /**
     * Encontra todos os produtos.
     * @returns Uma Promise que resolve para um array de entidades Product.
     */
    findAll(): Promise<Product[]>;

    /**
     * Encontra um produto pelo id.
     * @param id O email do produto a ser buscado.
     * @returns Uma Promise que resolve para um array de entidades Client.
     */
    findById(id: string): Promise<Product[]>;

    /**
     * Encontra um produto pelo nome.
     * @param name O email do produto a ser buscado.
     * @returns Uma Promise que resolve para a entidade Product ou null se não encontrada.
     */
    findByName(name: string): Promise<Product | null>;

    /**
     * Counta todos os produtos cadastrados.
     * @returns Um number que resolve para a quantidade de produtos cadastrados.
     */
    count(): Promise<Product | null>;

    /**
     * Cria e salva um novo produto no banco de dados.
     * @param productData Os dados do produto a serem criados.
     * @returns Uma Promise que resolve para a entidade Product criada.
     */
    create(productData: Partial<Product>): Promise<Product>; 
    /**
     * Atualiza um produto existente no banco de dados.
     * @param id O ID do produto a ser atualizado.
     * @param updateData Os dados a serem atualizados no produto.
     * @returns Uma Promise que resolve para a entidade Product atualizada ou null se o produto não for encontrado.
     */
    update(id: string, updateData: Partial<Product>): Promise<Product | null>; 

    /**
     * Deleta um produto do banco de dados pelo ID.
     * @param id O ID do produto a ser deletado.
     * @returns Uma Promise que resolve para true se o produto foi deletado com sucesso, false caso contrário.
     */
    delete(id: string): Promise<boolean>;
}

export const ProductRepository = AppDataSource.getRepository(Product).extend({

    async findById(id: string): Promise<Product | null> {
        return this.findOneBy({ id });
    },
    
    async findByName(name: string): Promise<Product[] | null> {
        return this.find({ where: { name: name } });
    },

    async findAll(): Promise<Product[]> {
        return this.find();
    },

    async count(): Promise<number> {
      console.log("Contando todos os produtos (via repositório customizado)...");
        return this.count();
    },

    async createAndSave(productData: Partial<Product>): Promise<Product> {
        const product = this.create(productData);
        return this.save(product);
    },

    async update(id: string, updateData: Partial<Product>): Promise<Product | null> {
        const productUpdate = await this.findOne({ where: { id: id } });
        if (!productUpdate) return null;
        Object.assign(productUpdate, updateData);
        return this.save(productUpdate);
    },

    async delete(id: string): Promise<boolean> {
        const deleteResult: DeleteResult = await this.delete(id); 
        return !!deleteResult.affected && deleteResult.affected > 0;
    }
});
