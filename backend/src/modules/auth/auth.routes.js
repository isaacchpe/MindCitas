import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { UserRepository } from './auth.repository.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { validate } from '../../middlewares/validate.js';
import {
  registerValidator,
  loginValidator,
  refreshValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from './auth.validators.js';

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const controller = new AuthController(authService);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Demasiados intentos de inicio de sesion, intenta de nuevo mas tarde',
  },
});

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registra un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan Perez
 *               email:
 *                 type: string
 *                 example: juan@universidad.edu.co
 *               password:
 *                 type: string
 *                 example: password123
 *               academicProgram:
 *                 type: string
 *                 example: Ingenieria de Sistemas
 *     responses:
 *       201:
 *         description: Usuario registrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       409:
 *         description: Email ya registrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Error de validacion
 */
router.post('/register', registerValidator, validate, controller.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Inicia sesion
 *     description: Rate limit de 10 solicitudes por 15 minutos por IP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan@universidad.edu.co
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Sesion iniciada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credenciales invalidas
 *       429:
 *         description: Demasiados intentos
 */
router.post('/login', loginLimiter, loginValidator, validate, controller.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Renueva el access token usando un refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nuevo access token generado
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
 *                     accessToken:
 *                       type: string
 *       401:
 *         description: Refresh token invalido o expirado
 */
router.post('/refresh', refreshValidator, validate, controller.refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Cierra la sesion del usuario
 *     responses:
 *       200:
 *         description: Sesion cerrada
 */
router.post('/logout', controller.logout);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Solicita un token de recuperacion de contrasena
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan@universidad.edu.co
 *     responses:
 *       200:
 *         description: Token de recuperacion generado
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
 *                     resetToken:
 *                       type: string
 *       404:
 *         description: Email no registrado
 */
router.post('/forgot-password', forgotPasswordValidator, validate, controller.forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Restablece la contrasena con un token valido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, newPassword]
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 example: nuevaPassword123
 *     responses:
 *       200:
 *         description: Contrasena actualizada
 *       400:
 *         description: Token invalido o usuario no encontrado
 */
router.post('/reset-password', resetPasswordValidator, validate, controller.resetPassword);

export default router;
