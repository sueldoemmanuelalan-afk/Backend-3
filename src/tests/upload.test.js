import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import app from '../app.js';
import userModel from '../models/user.model.js';

describe('Suite de Tests Funcionales - Carga de Archivos (Multer)', () => {

  let testUser;
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
  });

  after(async () => {
    if (fs.existsSync(dummyFilePath)) {
      fs.unlinkSync(dummyFilePath);
    }
    if (testUser) {
      await userModel.findByIdAndDelete(testUser._id);
    }
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

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

  it('POST /api/users/:uid/documents - Debe responder 404 si el usuario no existe', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .post(`/api/users/${fakeId}/documents`)
      .field('docType', 'DNI')
      .attach('document', dummyFilePath);

    expect(response.status).to.equal(404);
    expect(response.body).to.have.property('status', 'error');
  });

});