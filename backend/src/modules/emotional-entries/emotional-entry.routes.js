import { Router } from 'express';
import { EmotionalEntryRepository } from './emotional-entry.repository.js';
import { EmotionalEntryService } from './emotional-entry.service.js';
import { EmotionalEntryController } from './emotional-entry.controller.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';
import { validate } from '../../middlewares/validate.js';
import {
  registerEntryValidator,
  getByDateValidator,
  recentValidator,
} from './emotional-entry.validators.js';

const repository = new EmotionalEntryRepository();
const service = new EmotionalEntryService(repository);
const controller = new EmotionalEntryController(service);

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /emotional-entries:
 *   post:
 *     tags: [EmotionalEntries]
 *     summary: Registra o actualiza el estado emocional del dia
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [mood]
 *             properties:
 *               mood:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               note:
 *                 type: string
 *                 example: Buen dia en general
 *     responses:
 *       200:
 *         description: Registro creado o actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   $ref: '#/components/schemas/EmotionalEntry'
 *       400:
 *         description: Error de validacion
 *       401:
 *         description: No autenticado
 */
router.post('/', registerEntryValidator, validate, controller.register);

/**
 * @swagger
 * /emotional-entries/by-date/{date}:
 *   get:
 *     tags: [EmotionalEntries]
 *     summary: Obtiene el registro de un dia especifico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-04-27"
 *     responses:
 *       200:
 *         description: Registro del dia o null si no existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   $ref: '#/components/schemas/EmotionalEntry'
 *       401:
 *         description: No autenticado
 */
router.get('/by-date/:date', getByDateValidator, validate, controller.getByDate);

/**
 * @swagger
 * /emotional-entries/weekly-trend:
 *   get:
 *     tags: [EmotionalEntries]
 *     summary: Tendencia emocional de los ultimos 7 dias
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array de 7 elementos ordenados cronologicamente
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
 *                     $ref: '#/components/schemas/WeeklyTrendItem'
 *       401:
 *         description: No autenticado
 */
router.get('/weekly-trend', controller.weeklyTrend);

/**
 * @swagger
 * /emotional-entries/recent:
 *   get:
 *     tags: [EmotionalEntries]
 *     summary: Obtiene los registros mas recientes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 7
 *           minimum: 1
 *           maximum: 30
 *     responses:
 *       200:
 *         description: Lista de registros recientes
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
 *                     $ref: '#/components/schemas/EmotionalEntry'
 *       401:
 *         description: No autenticado
 */
router.get('/recent', recentValidator, validate, controller.recent);

export default router;
