import { ProductModel } from '../models/product.model.js';

export class ProductRepository {
  async findAll(filters = {}) {
    return await ProductModel.find(filters).lean();
  }

  async findById(id) {
    return await ProductModel.findById(id).lean();
  }

  async create(data) {
    return await ProductModel.create(data);
  }
}