import { ProductService } from '../services/products.service.js';

const productService = new ProductService();

export class ProductController {
  static async getAll(req, res) {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json({ status: 'success', payload: products });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      res.status(200).json({ status: 'success', payload: product });
    } catch (error) {
      res.status(404).json({ status: 'error', message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const newProduct = await productService.createProduct(req.body);
      res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
}