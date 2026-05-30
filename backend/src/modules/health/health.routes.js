import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Estado del servicio
 *     description: Endpoint de health check usado por Render para verificar disponibilidad
 *     responses:
 *       200:
 *         description: Servicio disponible
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                 dbStatus:
 *                   type: string
 *                   enum: [connected, disconnected]
 */
router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

export default router;
