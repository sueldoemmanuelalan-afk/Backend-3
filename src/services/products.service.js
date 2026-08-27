import { ProductRepository } from '../repositories/products.repository.js';
import { PRODUCT_STATUS } from '../constants/index.js';

const productRepository = new ProductRepository();

export class ProductService {
  async getAllProducts() {
    return await productRepository.findAll();
  }

  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error(`Producto con ID ${id} no encontrado.`);
    }
    return product;
  }

  async createProduct(data) {
    if (!data.name || !data.price) {
      throw new Error('El nombre y el precio son obligatorios.');
    }
    const productData = {
      ...data,
      status: data.status || PRODUCT_STATUS.AVAILABLE
    };
    return await productRepository.create(productData);
  }
}