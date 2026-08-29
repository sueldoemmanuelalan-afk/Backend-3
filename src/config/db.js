import mongoose from "mongoose";
import { config } from "./env.config.js";
import { logger } from "../utils/logger.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info("Conexión a MongoDB establecida con éxito");
  } catch (error) {
    logger.fatal(`Fallo crítico al conectar con MongoDB: ${error.message}`);
    throw error;
  }
};

export default connectDB;