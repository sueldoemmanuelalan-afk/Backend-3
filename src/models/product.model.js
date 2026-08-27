import { Schema, model } from 'mongoose';
import { PRODUCT_STATUS } from '../constants/index.js';

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: Object.values(PRODUCT_STATUS), 
    default: PRODUCT_STATUS.AVAILABLE 
  }
}, { timestamps: true });

export const ProductModel = model('Product', productSchema);