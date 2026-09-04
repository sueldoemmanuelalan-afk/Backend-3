import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../src/app.js';

describe('Suite de Tests Funcionales - ShipNow API', () => {

  before(async () => {
    const testMongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/shipnow_test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(testMongoUri);
    }
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
  });

  after(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  // 1. Swagger UI
  describe('Documentación - Swagger UI', () => {
    it('Debe responder 200 OK en la ruta de documentación /api/docs/', async () => {
      const response = await request(app).get('/api/docs/');
      expect(response.status).to.equal(200);
    });
  });

  // 2. Logger
  describe('Herramientas Internas - Logger', () => {
    it('GET /loggerTest - Debe responder 200 y registrar logs en todos los niveles', async () => {
      const response = await request(app).get('/loggerTest');
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('status', 'success');
      expect(response.body).to.have.property('message');
    });
  });

  // 3. Mocks
  describe('Módulo Mocks (/api/mocks)', () => {
    it('GET /api/mocks/users - Caso Exitoso: Generar usuarios simulados', async () => {
      const response = await request(app).get('/api/mocks/users?qty=3');
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('status', 'success');
      expect(response.body.payload).to.be.an('array').with.lengthOf(3);
      expect(response.body.payload[0]).to.have.property('email');
    });

    it('GET /api/mocks/users - Caso Error: Responder 400 ante cantidad negativa', async () => {
      const response = await request(app).get('/api/mocks/users?qty=-5');
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('status', 'error');
      expect(response.body).to.have.property('error', 'InvalidQuantityError');
      expect(response.body).to.have.property('code', 4);
    });

    it('POST /api/mocks/seed - Caso Exitoso: Poblar la BD de pruebas', async () => {
      const response = await request(app).post('/api/mocks/seed?qty=2');
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('status', 'success');
      expect(response.body.payload).to.have.property('usersInserted');
    });
  });

  // 4. Errores y Rutas Inexistentes
  describe('Manejo Centralizado de Errores', () => {
    it('GET /api/ruta-inexistente - Debe responder 404 con formato unificado de error', async () => {
      const response = await request(app).get('/api/ruta-inexistente');
      expect(response.status).to.equal(404);
      expect(response.body).to.have.property('status', 'error');
      expect(response.body).to.have.property('error', 'NotFoundError');
      expect(response.body).to.have.property('code', 2);
    });
  });

});