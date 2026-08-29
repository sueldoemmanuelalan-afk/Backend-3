import { Router } from 'express';
import { logger } from '../utils/logger.js';

const router = Router();

router.get('/loggerTest', (req, res) => {
  logger.fatal('Prueba de log: Nivel FATAL');
  logger.error('Prueba de log: Nivel ERROR');
  logger.warning('Prueba de log: Nivel WARNING');
  logger.info('Prueba de log: Nivel INFO');
  logger.http('Prueba de log: Nivel HTTP');
  logger.debug('Prueba de log: Nivel DEBUG');

  res.status(200).json({
    status: 'success',
    message: 'Logs generados exitosamente. Revisa la consola y la carpeta /logs.'
  });
});

export default router;