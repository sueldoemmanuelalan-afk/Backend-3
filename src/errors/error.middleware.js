import { EErrors } from './enum.js';

export const errorHandler = (error, req, res, next) => {
  console.error(`[ERROR HANDLER]: ${error.name} - ${error.message}`);
  if (error.cause) console.error(`[CAUSE]: ${error.cause}`);

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    status: 'error',
    error: error.name || 'UnhandledError',
    message: error.message || 'Error interno del servidor',
    code: error.code || EErrors.INTERNAL_SERVER_ERROR,
    ...(process.env.NODE_ENV === 'development' && { cause: error.cause })
  });
};