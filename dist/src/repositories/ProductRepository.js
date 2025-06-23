import { AppDataSource } from '../database/index.js';
import { Product } from '../database/entities/Product.js';
export const ProductRepository = AppDataSource.getRepository(Product).extend({
    async findById(id) {
        return this.findOneBy({ id });
    },
    async findByName(name) {
        return this.findOne({ where: { name: name } });
    },
    async findAll() {
        return this.find();
    },
    async count() {
        console.log("Contando todos os produtos (via repositório customizado)...");
        return this.count();
    },
    async createAndSave(productData) {
        const product = this.create(productData);
        return this.save(product);
    },
    async update(id, updateData) {
        const productUpdate = await this.findOne({ where: { id: id } });
        if (!productUpdate)
            return null;
        Object.assign(productUpdate, updateData);
        return this.save(productUpdate);
    },
    async delete(id) {
        const deleteResult = await this.delete(id);
        return !!deleteResult.affected && deleteResult.affected > 0;
    }
});
