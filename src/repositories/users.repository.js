import UserModel from "../models/user.model.js";

export class UserRepository {
  async findAll({ page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;

    const [docs, totalDocs] = await Promise.all([
      UserModel.find()
        .skip(skip)
        .limit(limit),
      UserModel.countDocuments()
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
    return await UserModel.findById(id);
  }

  async create(userData) {
    return await UserModel.create(userData);
  }

  async update(id, userData) {
    return await UserModel.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true
    });
  }

  async delete(id) {
    return await UserModel.findByIdAndDelete(id);
  }
}