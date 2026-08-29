import { EErrors } from './enum.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  if (statusCode >= 400 && statusCode < 500) {
    logger.warning(`[${error.name || 'ClientError'}]: ${error.message} - Path: ${req.originalUrl}`);
  } else {
    logger.error(`[${error.name || 'ServerError'}]: ${error.message} - Cause: ${error.cause || 'No cause specified'}`);
  }

  res.status(statusCode).json({
    status: 'error',
    error: error.name || 'UnhandledError',
    message: error.message || 'Error interno del servidor',
    code: error.code || EErrors.INTERNAL_SERVER_ERROR,
    ...(process.env.NODE_ENV === 'development' && { cause: error.cause })
  });
};