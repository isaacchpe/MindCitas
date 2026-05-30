import { Router } from 'express';
import { UserRepository } from './users.repository.js';
import { UserService } from './users.service.js';
import { UserController } from './users.controller.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';
import { validate } from '../../middlewares/validate.js';
import { updateMeValidator } from './users.validators.js';

const repository = new UserRepository();
const service = new UserService(repository);
const controller = new UserController(service);

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /users/me:
 *   get:
 *     tags: [Users]
 *     summary: Obtiene el perfil del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/me', controller.getMe);

/**
 * @swagger
 * /users/me:
 *   put:
 *     tags: [Users]
 *     summary: Actualiza el perfil del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Juan Garcia Lopez
 *               program:
 *                 type: string
 *                 example: Ingenieria de Software
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Error de validacion
 *       401:
 *         description: No autenticado
 */
router.put('/me', updateMeValidator, validate, controller.updateMe);

/**
 * @swagger
 * /users/me/badges:
 *   get:
 *     tags: [Users]
 *     summary: Obtiene las insignias del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de insignias
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
 *       401:
 *         description: No autenticado
 */
router.get('/me/badges', controller.getMyBadges);

export default router;
