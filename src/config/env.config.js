import dotenv from 'dotenv';

dotenv.config();

const requiredVars = ['PORT', 'MONGODB_URI', 'NODE_ENV'];

for (const envVar of requiredVars) {
  if (!process.env[envVar]) {
    throw new Error(`[Config Error]: La variable de entorno ${envVar} es obligatoria.`);
  }
}

export const config = {
  port: process.env.PORT || 8080,
  mongoUri: process.env.MONGODB_URI,
  env: process.env.NODE_ENV || 'development'
};