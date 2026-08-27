import UserModel from "../models/user.model.js";

export class UserRepository {
  async findAll() {
    return await UserModel.find();
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