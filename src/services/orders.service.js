import { OrderRepository } from "../repositories/orders.repository.js";
import { UserRepository } from "../repositories/users.repository.js";
import { StoreRepository } from "../repositories/stores.repository.js";

const orderRepository = new OrderRepository();
const userRepository = new UserRepository();
const storeRepository = new StoreRepository();

export class OrderService {
  async getAllOrders() {
    return await orderRepository.findAll();
  }

  async getOrderById(id) {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new Error("Pedido no encontrado");
    }
    return order;
  }

  async createOrder(orderData) {
    const { customer, store, items, deliveryAddress, priority } = orderData;

    if (!customer || !store || !items || !deliveryAddress) {
      throw new Error("Faltan datos obligatorios");
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("El pedido debe tener al menos un producto");
    }

    const customerFound = await userRepository.findById(customer);
    if (!customerFound) {
      throw new Error("Usuario no encontrado");
    }

    const storeFound = await storeRepository.findById(store);
    if (!storeFound) {
      throw new Error("Comercio no encontrado");
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
      throw new Error("Pedido no encontrado");
    }
    return order;
  }

  async deleteOrder(id) {
    const order = await orderRepository.delete(id);
    if (!order) {
      throw new Error("Pedido no encontrado");
    }
    return order;
  }
}