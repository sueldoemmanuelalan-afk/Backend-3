import { OrderRepository } from "../repositories/orders.repository.js";
import { UserRepository } from "../repositories/users.repository.js";
import { StoreRepository } from "../repositories/stores.repository.js";
import { CustomError } from "../errors/custom.error.js";
import { EErrors } from "../errors/enum.js";

const orderRepository = new OrderRepository();
const userRepository = new UserRepository();
const storeRepository = new StoreRepository();

export class OrderService {
  async getAllOrders({ page = 1, limit = 10 } = {}) {
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.max(1, parseInt(limit, 10) || 10);
    
    return await orderRepository.findAll({ page: parsedPage, limit: parsedLimit });
  }

  async getOrderById(id) {
    const order = await orderRepository.findById(id);
    if (!order) {
      CustomError.createError({
        name: "NotFoundError",
        cause: `No se encontró el pedido con ID ${id}`,
        message: "Pedido no encontrado",
        code: EErrors.RESOURCE_NOT_FOUND,
        statusCode: 404
      });
    }
    return order;
  }

  async createOrder(orderData) {
    const { customer, store, items, deliveryAddress, priority } = orderData;

    if (!customer || !store || !items || !deliveryAddress) {
      CustomError.createError({
        name: "InvalidParamsError",
        cause: "Faltan campos requeridos en el cuerpo de la solicitud.",
        message: "Faltan datos obligatorios para crear el pedido",
        code: EErrors.INVALID_TYPES_ERROR,
        statusCode: 400
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      CustomError.createError({
        name: "InvalidItemsError",
        cause: "El array de items se encuentra vacío o no es un arreglo.",
        message: "El pedido debe tener al menos un producto",
        code: EErrors.INVALID_TYPES_ERROR,
        statusCode: 400
      });
    }

    const customerFound = await userRepository.findById(customer);
    if (!customerFound) {
      CustomError.createError({
        name: "NotFoundError",
        cause: `No existe cliente registrado con ID ${customer}`,
        message: "Usuario cliente no encontrado",
        code: EErrors.RESOURCE_NOT_FOUND,
        statusCode: 404
      });
    }

    const storeFound = await storeRepository.findById(store);
    if (!storeFound) {
      CustomError.createError({
        name: "NotFoundError",
        cause: `No existe comercio registrado con ID ${store}`,
        message: "Comercio no encontrado",
        code: EErrors.RESOURCE_NOT_FOUND,
        statusCode: 404
      });
    }

    const total = items.reduce(
      (accumulator, item) => accumulator + item.price * item.quantity,
      0
    );

    return await orderRepository.create({
      customer,
      store,
      items,
      deliveryAddress,
      priority,
      total
    });
  }

  async updateOrderStatus(id, status) {
    const order = await orderRepository.updateStatus(id, status);
    if (!order) {
      CustomError.createError({
        name: "NotFoundError",
        cause: `No se encontró el pedido con ID ${id}`,
        message: "Pedido no encontrado para actualizar",
        code: EErrors.RESOURCE_NOT_FOUND,
        statusCode: 404
      });
    }
    return order;
  }

  async deleteOrder(id) {
    const order = await orderRepository.delete(id);
    if (!order) {
      CustomError.createError({
        name: "NotFoundError",
        cause: `No se encontró el pedido con ID ${id}`,
        message: "Pedido no encontrado para eliminar",
        code: EErrors.RESOURCE_NOT_FOUND,
        statusCode: 404
      });
    }
    return order;
  }

  async attachProof(id, proofMeta) {
    const order = await orderRepository.findById(id);
    if (!order) {
      CustomError.createError({
        name: "NotFoundError",
        cause: `No se encontró la orden con ID ${id}`,
        message: "Orden no encontrada para adjuntar comprobante",
        code: EErrors.RESOURCE_NOT_FOUND,
        statusCode: 404
      });
    }

    order.proof = proofMeta;
    return await orderRepository.update(id, { proof: proofMeta });
  }
}