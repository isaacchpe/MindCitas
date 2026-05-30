import { Router } from 'express';
import { AdminRepository } from './admin.repository.js';
import { AdminService } from './admin.service.js';
import { AdminController } from './admin.controller.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';
import { requireRole } from '../../middlewares/requireRole.js';
import { validate } from '../../middlewares/validate.js';
import { toggleUserValidator } from './admin.validators.js';

const repo = new AdminRepository();
const service = new AdminService(repo);
const controller = new AdminController(service);

const router = Router();

router.use(authMiddleware, requireRole(['admin']));

/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Lista usuarios registrados (paginado)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Filtro por email o nombre
 *     responses:
 *       200:
 *         description: Lista paginada de usuarios
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
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No es administrador
 */
router.get('/users', controller.listUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   patch:
 *     tags: [Admin]
 *     summary: Activa o desactiva un usuario
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
 *             required: [isActive]
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       400:
 *         description: No puedes desactivar tu propia cuenta
 *       403:
 *         description: No es administrador
 */
router.patch('/users/:id', toggleUserValidator, validate, controller.toggleUser);

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Metricas generales de la plataforma
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadisticas de la plataforma
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
 *                     totalUsers:
 *                       type: integer
 *                     activeUsers:
 *                       type: integer
 *                     totalSessions:
 *                       type: integer
 *                     sessionsLast7Days:
 *                       type: integer
 *                     totalEmotionalEntries:
 *                       type: integer
 *                     entriesLast7Days:
 *                       type: integer
 *                     totalHabits:
 *                       type: integer
 *                     completedTodayCount:
 *                       type: integer
 *       403:
 *         description: No es administrador
 */
router.get('/stats', controller.getStats);

export default router;
