import express from "express";
import cors from "cors";
import productsRouter from './routes/products.router.js';
import usersRouter from "./routes/users.router.js";
import storesRouter from "./routes/stores.router.js";
import ordersRouter from "./routes/orders.router.js";
import mocksRouter from './routes/mocks.router.js';
import loggerRouter from './routes/logger.router.js';
import { httpLogger } from './utils/logger.js';
import { errorHandler } from './errors/error.middleware.js'; // <--- ASEGÚRATE DE TENER ESTA LÍNEA
import { CustomError } from './errors/custom.error.js';
import { EErrors } from './errors/enum.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(httpLogger);

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "ShipNow API"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "success",
    message: "API funcionando"
  });
});

app.use('/', loggerRouter);
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/stores", storesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/mocks", mocksRouter);

app.use((req, res, next) => {
  CustomError.createError({
    name: 'NotFoundError',
    cause: `No existe la ruta ${req.method} ${req.originalUrl}`,
    message: 'Ruta no encontrada',
    code: EErrors.RESOURCE_NOT_FOUND,
    statusCode: 404
  });
});

// Middleware global de errores (SIEMPRE AL FINAL)
app.use(errorHandler);

export default app;
