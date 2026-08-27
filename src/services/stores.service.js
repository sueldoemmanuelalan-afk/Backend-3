import { StoreRepository } from "../repositories/stores.repository.js";

const storeRepository = new StoreRepository();

export class StoreService {
  async getAllStores() {
    return await storeRepository.findAll();
  }

  async getStoreById(id) {
    const store = await storeRepository.findById(id);
    if (!store) {
      throw new Error("Comercio no encontrado");
    }
    return store;
  }

  async createStore(storeData) {
    return await storeRepository.create(storeData);
  }

  async updateStore(id, storeData) {
    const store = await storeRepository.update(id, storeData);
    if (!store) {
      throw new Error("Comercio no encontrado");
    }
    return store;
  }

  async deleteStore(id) {
    const store = await storeRepository.delete(id);
    if (!store) {
      throw new Error("Comercio no encontrado");
    }
    return store;
  }
}