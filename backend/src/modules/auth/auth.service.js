import jwt from 'jsonwebtoken';
import { config } from '../../config/env.js';
import { logger } from '../../config/logger.js';
import { AppError } from '../../utils/AppError.js';

export class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Genera par de tokens JWT (access + refresh).
   * @param {string} userId
   * @param {string} [role='student']
   * @returns {{accessToken: string, refreshToken: string}}
   */
  signTokens(userId, role = 'student') {
    const accessToken = jwt.sign({ id: userId, role }, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpires,
    });
    const refreshToken = jwt.sign({ id: userId, role }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpires,
    });
    return { accessToken, refreshToken };
  }

  /**
   * Registra un nuevo usuario y genera tokens de sesion.
   * @param {{name: string, email: string, password: string, academicProgram?: string}} data
   * @returns {Promise<{user: object, accessToken: string, refreshToken: string}>}
   * @throws {AppError} 409 si el email ya esta registrado
   */
  async register({ name, email, password, academicProgram }) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new AppError('El email ya está registrado', 409);
    }

    const user = await this.userRepository.create({ name, email, password, academicProgram });
    const { accessToken, refreshToken } = this.signTokens(user._id, user.role);

    return { user, accessToken, refreshToken };
  }

  /**
   * Autentica al usuario con email y contrasena.
   * @param {{email: string, password: string}} credentials
   * @returns {Promise<{user: object, accessToken: string, refreshToken: string}>}
   * @throws {AppError} 401 si las credenciales son invalidas
   */
  async login({ email, password }) {
    const user = await this.userRepository.findByEmail(email, true);
    if (!user) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const { accessToken, refreshToken } = this.signTokens(user._id, user.role);
    return { user, accessToken, refreshToken };
  }

  /**
   * Renueva el access token usando un refresh token valido.
   * @param {string} refreshToken
   * @returns {Promise<{accessToken: string}>}
   * @throws {AppError} 404 si el usuario no existe
   */
  async refresh(refreshToken) {
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    const user = await this.userRepository.findById(decoded.id);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role || 'student' },
      config.jwt.accessSecret,
      {
        expiresIn: config.jwt.accessExpires,
      }
    );
    return { accessToken };
  }

  /**
   * Cierra la sesion del usuario (stub sin blacklist en este sprint).
   * @returns {{message: string}}
   */
  logout() {
    return { message: 'Sesión cerrada' };
  }

  /**
   * Genera un token de recuperacion de contrasena.
   * @param {{email: string}} data
   * @returns {Promise<{resetToken: string}>}
   * @throws {AppError} 404 si el email no existe
   */
  async forgotPassword({ email }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('No existe una cuenta con ese email', 404);
    }

    const resetToken = jwt.sign({ id: user._id }, config.jwt.accessSecret, {
      expiresIn: '15m',
    });

    if (config.nodeEnv === 'development') {
      logger.info(`Token de recuperación para ${email}: ${resetToken}`);
    }

    return { resetToken };
  }

  /**
   * Restablece la contrasena usando un token de recuperacion.
   * @param {{token: string, newPassword: string}} data
   * @returns {Promise<{message: string}>}
   * @throws {AppError} 400 si el token es invalido
   */
  async resetPassword({ token, newPassword }) {
    const decoded = jwt.verify(token, config.jwt.accessSecret);
    const user = await this.userRepository.updateById(decoded.id, { password: newPassword });
    if (!user) {
      throw new AppError('Token inválido o usuario no encontrado', 400);
    }

    return { message: 'Contraseña actualizada' };
  }
}
