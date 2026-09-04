import OrderModel from "../models/order.model.js";

export class OrderRepository {
  async findAll({ page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;

    const [docs, totalDocs] = await Promise.all([
      OrderModel.find()
        .populate('customer')
        .populate('store')
        .skip(skip)
        .limit(limit),
      OrderModel.countDocuments()
    ]);

    const totalPages = Math.ceil(totalDocs / limit) || 1;

    return {
      docs,
      totalDocs,
      totalPages,
      page,
      limit,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages
    };
  }

  async findById(id) {
    return await OrderModel.findById(id).populate("customer").populate("store");
  }

  async create(orderData) {
    return await OrderModel.create(orderData);
  }

  async update(id, orderData) {
    return await OrderModel.findByIdAndUpdate(id, orderData, {
      new: true,
      runValidators: true
    });
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