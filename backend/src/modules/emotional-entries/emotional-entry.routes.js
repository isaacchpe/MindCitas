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

/**
 * @swagger
 * /emotional-entries/monthly-trend:
 *   get:
 *     tags: [EmotionalEntries]
 *     summary: Tendencia emocional de los ultimos 30 dias
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array de 30 puntos ordenados cronologicamente
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
 *                       date:
 *                         type: string
 *                         format: date
 *                       moodLevel:
 *                         type: integer
 *                         nullable: true
 *                         minimum: 1
 *                         maximum: 5
 *       401:
 *         description: No autenticado
 */
router.get('/monthly-trend', controller.monthlyTrend);

/**
 * @swagger
 * /emotional-entries/export-csv:
 *   get:
 *     tags: [EmotionalEntries]
 *     summary: Exporta todos los registros del usuario en formato CSV
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archivo CSV
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       401:
 *         description: No autenticado
 */
router.get('/export-csv', controller.exportCsv);

/**
 * @swagger
 * /emotional-entries/check-alert:
 *   get:
 *     tags: [EmotionalEntries]
 *     summary: Verifica si hay patron negativo en los ultimos registros
 *     description: Retorna alerta si los ultimos 3 dias consecutivos tienen mood <= 2
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resultado de la verificacion
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
 *                     alert:
 *                       type: boolean
 *                     suggestion:
 *                       type: string
 *       401:
 *         description: No autenticado
 */
router.get('/check-alert', controller.checkAlert);

export default router;
