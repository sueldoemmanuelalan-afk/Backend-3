import OrderModel from "../models/order.model.js";

export class OrderRepository {
  async findAll() {
    return await OrderModel.find().populate("customer").populate("store");
  }

  async findById(id) {
    return await OrderModel.findById(id).populate("customer").populate("store");
  }

  async create(orderData) {
    return await OrderModel.create(orderData);
  }

  async updateStatus(id, status) {
    return await OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
  }

  async delete(id) {
    return await OrderModel.findByIdAndDelete(id);
  }
}