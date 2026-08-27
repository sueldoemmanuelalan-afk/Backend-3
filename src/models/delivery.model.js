import { Schema, model } from 'mongoose';

const deliverySchema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  driver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['assigned', 'in_transit', 'delivered', 'failed'], 
    default: 'assigned' 
  },
  notes: { type: String, default: '' }
}, { timestamps: true });

export const Delivery = model('Delivery', deliverySchema);