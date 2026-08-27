import StoreModel from "../models/store.model.js";

export class StoreRepository {
  async findAll() {
    return await StoreModel.find();
  }

  async findById(id) {
    return await StoreModel.findById(id);
  }

  async create(storeData) {
    return await StoreModel.create(storeData);
  }

  async update(id, storeData) {
    return await StoreModel.findByIdAndUpdate(id, storeData, {
      new: true,
      runValidators: true
    });
  }

  async delete(id) {
    return await StoreModel.findByIdAndDelete(id);
  }
}