import { Router } from 'express';
import { SessionRepository } from './sessions.repository.js';
import { SessionService } from './sessions.service.js';
import { SessionController } from './sessions.controller.js';
import { UserRepository } from '../users/users.repository.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';
import { validate } from '../../middlewares/validate.js';
import {
  createSessionValidator,
  rescheduleValidator,
  availableSlotsValidator,
} from './sessions.validators.js';

const sessionRepo = new SessionRepository();
const userRepo = new UserRepository();
const service = new SessionService(sessionRepo, userRepo);
const controller = new SessionController(service);

const router = Router();

/**
 * @swagger
 * /sessions/types:
 *   get:
 *     tags: [Sessions]
 *     summary: Catalogo de tipos de sesion
 *     responses:
 *       200:
 *         description: Lista de tipos disponibles
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
 *                     $ref: '#/components/schemas/SessionType'
 */
router.get('/types', controller.getTypes);

/**
 * @swagger
 * /sessions/available-slots:
 *   get:
 *     tags: [Sessions]
 *     summary: Slots disponibles para una fecha y tipo de sesion
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-06-02"
 *       - in: query
 *         name: sessionType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [psychology, mindfulness, academic, group]
 *     responses:
 *       200:
 *         description: Slots por profesional
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
 *                       professionalId:
 *                         type: string
 *                       professionalName:
 *                         type: string
 *                       slots:
 *                         type: array
 *                         items:
 *                           type: string
 *                           format: date-time
 *       401:
 *         description: No autenticado
 */
router.get(
  '/available-slots',
  authMiddleware,
  availableSlotsValidator,
  validate,
  controller.getAvailableSlots
);

/**
 * @swagger
 * /sessions:
 *   post:
 *     tags: [Sessions]
 *     summary: Agenda una nueva sesion
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [professionalId, sessionType, scheduledAt]
 *             properties:
 *               professionalId:
 *                 type: string
 *               sessionType:
 *                 type: string
 *                 enum: [psychology, mindfulness, academic, group]
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Sesion creada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   $ref: '#/components/schemas/Session'
 *       400:
 *         description: Error de validacion
 *       409:
 *         description: Slot ya reservado
 */
router.post('/', authMiddleware, createSessionValidator, validate, controller.create);

/**
 * @swagger
 * /sessions/mine:
 *   get:
 *     tags: [Sessions]
 *     summary: Historial de sesiones del usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, completed, canceled, no_show, all]
 *           default: all
 *     responses:
 *       200:
 *         description: Lista de sesiones
 *       401:
 *         description: No autenticado
 */
router.get('/mine', authMiddleware, controller.listMine);

/**
 * @swagger
 * /sessions/{id}:
 *   get:
 *     tags: [Sessions]
 *     summary: Detalle de una sesion
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
 *         description: Detalle de la sesion
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tienes acceso a esta sesion
 *       404:
 *         description: Sesion no encontrada
 */
router.get('/:id', authMiddleware, controller.getDetail);

/**
 * @swagger
 * /sessions/{id}:
 *   put:
 *     tags: [Sessions]
 *     summary: Reprograma una sesion
 *     description: Solo si la sesion esta agendada y a mas de 24h en el futuro
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [scheduledAt]
 *             properties:
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Sesion reprogramada
 *       400:
 *         description: No se puede reprogramar
 *       409:
 *         description: Nuevo horario ya reservado
 */
router.put('/:id', authMiddleware, rescheduleValidator, validate, controller.reschedule);

/**
 * @swagger
 * /sessions/{id}:
 *   delete:
 *     tags: [Sessions]
 *     summary: Cancela una sesion
 *     description: Solo si la sesion esta agendada y a mas de 24h en el futuro
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
 *         description: Sesion cancelada
 *       400:
 *         description: No se puede cancelar
 *       403:
 *         description: No tienes acceso a esta sesion
 */
router.delete('/:id', authMiddleware, controller.cancel);

export default router;
