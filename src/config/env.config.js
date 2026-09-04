import dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error('[Config Error]: La variable de entorno MONGODB_URI es obligatoria.');
}

if (!process.env.PORT) {
  throw new Error('[Config Error]: La variable de entorno PORT es obligatoria.');
}

export const config = {
  port: process.env.PORT || 8080,
  mongoUri: mongoUri,
  env: process.env.NODE_ENV || 'development'
};