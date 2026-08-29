import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import app from '../app.js';
import userModel from '../models/user.model.js';
import orderModel from '../models/order.model.js';
import storeModel from '../models/store.model.js';

describe('Suite de Tests Funcionales - Carga de Archivos (Multer)', () => {

  let testUser;
  let testStore;
  let testOrder;
  const dummyFilePath = path.join(process.cwd(), 'src/tests/dummy.pdf');

  before(async () => {
    const testMongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/shipnow_test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(testMongoUri);
    }

    fs.writeFileSync(dummyFilePath, 'Contenido de prueba PDF');

    testUser = await userModel.create({
      firstName: 'Tester',
      lastName: 'Multer',
      email: `test.upload.${Date.now()}@example.com`,
      password: 'password123',
      role: 'customer'
    });

    testStore = await storeModel.create({
      name: 'Tienda Test',
      address: 'Calle Falsa 123',
      owner: testUser._id
    });

    testOrder = await orderModel.create({
      customer: testUser._id,
      store: testStore._id,
      deliveryAddress: 'Av. Siempre Viva 742',
      items: [{ name: 'Producto Test', quantity: 1, price: 500 }],
      total: 500
    });
  });

  after(async () => {
    if (fs.existsSync(dummyFilePath)) {
      fs.unlinkSync(dummyFilePath);
    }
    if (testUser) {
      await userModel.findByIdAndDelete(testUser._id);
    }
    if (testStore) {
      await storeModel.findByIdAndDelete(testStore._id);
    }
    if (testOrder) {
      await orderModel.findByIdAndDelete(testOrder._id);
    }
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  // --- TESTS DE DOCUMENTOS DE USUARIO ---

  it('POST /api/users/:uid/documents - Debe subir un documento correctamente', async () => {
    const response = await request(app)
      .post(`/api/users/${testUser._id}/documents`)
      .field('docType', 'DNI')
      .attach('document', dummyFilePath);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body.payload).to.have.property('docType', 'DNI');
  });

  it('POST /api/users/:uid/documents - Debe responder 400 si falta el archivo', async () => {
    const response = await request(app)
      .post(`/api/users/${testUser._id}/documents`)
      .field('docType', 'DNI');

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('status', 'error');
  });

  it('POST /api/users/:uid/documents - Debe responder 400 con un tipo de documento inválido', async () => {
    const response = await request(app)
      .post(`/api/users/${testUser._id}/documents`)
      .field('docType', 'TIPO_INVALIDO_XYZ')
      .attach('document', dummyFilePath);

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('status', 'error');
  });

  it('POST /api/users/:uid/documents - Debe responder 404 si el usuario no existe', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .post(`/api/users/${fakeId}/documents`)
      .field('docType', 'DNI')
      .attach('document', dummyFilePath);

    expect(response.status).to.equal(404);
    expect(response.body).to.have.property('status', 'error');
  });

  // --- TESTS DE COMPROBANTES DE PEDIDOS/ENTREGAS ---

  it('POST /api/orders/:oid/proof - Debe subir un comprobante de entrega correctamente', async () => {
    const response = await request(app)
      .post(`/api/orders/${testOrder._id}/proof`)
      .attach('proof', dummyFilePath);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body.payload).to.have.property('mimeType', 'application/pdf');
  });

  it('POST /api/orders/:oid/proof - Debe responder 404 si la orden no existe', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .post(`/api/orders/${fakeId}/proof`)
      .attach('proof', dummyFilePath);

    expect(response.status).to.equal(404);
    expect(response.body).to.have.property('status', 'error');
  });

});