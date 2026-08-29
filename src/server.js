import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import { logger } from "./utils/logger.js";

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`Servidor ShipNow escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    logger.fatal(`Error crítico al iniciar el servidor: ${error.message}`);
    process.exit(1);
  }
};

startServer();
