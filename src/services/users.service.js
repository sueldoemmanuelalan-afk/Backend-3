import { UserRepository } from "../repositories/users.repository.js";
import { CustomError } from "../errors/custom.error.js";
import { EErrors } from "../errors/enum.js";

const userRepository = new UserRepository();

export class UserService {
  async getAllUsers({ page = 1, limit = 10 } = {}) {
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.max(1, parseInt(limit, 10) || 10);

    return await userRepository.findAll({ page: parsedPage, limit: parsedLimit });
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      CustomError.createError({
        name: "NotFoundError",
        cause: `No se encontró el usuario con ID ${id}`,
        message: "Usuario no encontrado",
        code: EErrors.RESOURCE_NOT_FOUND,
        statusCode: 404
      });
    }
    return user;
  }

  async createUser(userData) {
    return await userRepository.create(userData);
  }

  async updateUser(id, userData) {
    const user = await userRepository.update(id, userData);
    if (!user) {
      CustomError.createError({
        name: "NotFoundError",
        cause: `No se encontró el usuario con ID ${id}`,
        message: "Usuario no encontrado para actualizar",
        code: EErrors.RESOURCE_NOT_FOUND,
        statusCode: 404
      });
    }
    return user;
  }

  async deleteUser(id) {
    const user = await userRepository.delete(id);
    if (!user) {
      CustomError.createError({
        name: "NotFoundError",
        cause: `No se encontró el usuario con ID ${id}`,
        message: "Usuario no encontrado para eliminar",
        code: EErrors.RESOURCE_NOT_FOUND,
        statusCode: 404
      });
    }
    return user;
  }

  async addDocument(id, documentMeta) {
    const user = await this.getUserById(id);
    
    const updatedDocuments = user.documents ? [...user.documents, documentMeta] : [documentMeta];
    return await userRepository.update(id, { documents: updatedDocuments });
  }
}