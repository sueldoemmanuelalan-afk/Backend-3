import { Router } from 'express';
import { config } from '../config/env.config.js'; // Ajusta la ruta a tu env.config si es necesario

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    environment: config.env,
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString()
  });
});

export default router;