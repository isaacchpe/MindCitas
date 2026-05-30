import { Router } from 'express';
import { HabitRepository } from './habits.repository.js';
import { HabitService } from './habits.service.js';
import { HabitController } from './habits.controller.js';

const repo = new HabitRepository();
const service = new HabitService(repo);
const controller = new HabitController(service);

const router = Router();

/**
 * @swagger
 * /badges:
 *   get:
 *     tags: [Badges]
 *     summary: Catalogo completo de insignias
 *     responses:
 *       200:
 *         description: Lista de insignias disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Badge'
 */
router.get('/', controller.listBadges);

export default router;
