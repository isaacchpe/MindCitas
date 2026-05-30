import { Router } from 'express';
import { HabitRepository } from './habits.repository.js';
import { HabitService } from './habits.service.js';
import { HabitController } from './habits.controller.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';
import { validate } from '../../middlewares/validate.js';
import { createHabitValidator } from './habits.validators.js';

const repo = new HabitRepository();
const service = new HabitService(repo);
const controller = new HabitController(service);

const router = Router();

/**
 * @swagger
 * /habits/predefined:
 *   get:
 *     tags: [Habits]
 *     summary: Catalogo de habitos predefinidos
 *     responses:
 *       200:
 *         description: Lista de habitos predefinidos
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
 *                     type: object
 *                     properties:
 *                       habitType:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 */
router.get('/predefined', controller.getPredefined);

/**
 * @swagger
 * /habits:
 *   post:
 *     tags: [Habits]
 *     summary: Crea un nuevo habito para el usuario
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [habitType]
 *             properties:
 *               habitType:
 *                 type: string
 *                 enum: [meditation, exercise, reading, hydration, sleep, custom]
 *               name:
 *                 type: string
 *                 example: Meditacion matutina
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Habito creado
 *       400:
 *         description: Error de validacion
 *       401:
 *         description: No autenticado
 */
router.post('/', authMiddleware, createHabitValidator, validate, controller.create);

/**
 * @swagger
 * /habits/mine:
 *   get:
 *     tags: [Habits]
 *     summary: Lista los habitos activos del usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de habitos con estado de racha
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
 *                     $ref: '#/components/schemas/HabitSummary'
 *       401:
 *         description: No autenticado
 */
router.get('/mine', authMiddleware, controller.listMine);

/**
 * @swagger
 * /habits/{id}/streak:
 *   get:
 *     tags: [Habits]
 *     summary: Detalle de racha de un habito
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle de racha
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   type: object
 *                   properties:
 *                     currentStreak:
 *                       type: integer
 *                     bestStreak:
 *                       type: integer
 *                     completedDates:
 *                       type: array
 *                       items:
 *                         type: string
 *                         format: date
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tienes acceso a este habito
 *       404:
 *         description: Habito no encontrado
 */
router.get('/:id/streak', authMiddleware, controller.getStreak);

/**
 * @swagger
 * /habits/{id}/check:
 *   post:
 *     tags: [Habits]
 *     summary: Marca el habito como completado hoy
 *     description: Idempotente. Si ya fue marcado hoy, retorna el mismo estado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resultado del check
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   type: object
 *                   properties:
 *                     currentStreak:
 *                       type: integer
 *                     bestStreak:
 *                       type: integer
 *                     awardedBadge:
 *                       type: object
 *                       nullable: true
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tienes acceso a este habito
 */
router.post('/:id/check', authMiddleware, controller.check);

/**
 * @swagger
 * /habits/{id}:
 *   delete:
 *     tags: [Habits]
 *     summary: Desactiva un habito (soft delete)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Habito desactivado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tienes acceso a este habito
 */
router.delete('/:id', authMiddleware, controller.remove);

export default router;
