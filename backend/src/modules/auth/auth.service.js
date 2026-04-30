import jwt from 'jsonwebtoken';
import { config } from '../../config/env.js';
import { logger } from '../../config/logger.js';
import { AppError } from '../../utils/AppError.js';

export class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  signTokens(userId) {
    const accessToken = jwt.sign({ id: userId }, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpires,
    });
    const refreshToken = jwt.sign({ id: userId }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpires,
    });
    return { accessToken, refreshToken };
  }

  async register({ name, email, password, academicProgram }) {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new AppError('El email ya esta registrado', 409);
    }

    const user = await this.userRepository.create({ name, email, password, academicProgram });
    const { accessToken, refreshToken } = this.signTokens(user._id);

    return { user, accessToken, refreshToken };
  }

  async login({ email, password }) {
    const user = await this.userRepository.findByEmail(email, true);
    if (!user) {
      throw new AppError('Credenciales invalidas', 401);
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      throw new AppError('Credenciales invalidas', 401);
    }

    const { accessToken, refreshToken } = this.signTokens(user._id);
    return { user, accessToken, refreshToken };
  }

  async refresh(refreshToken) {
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    const user = await this.userRepository.findById(decoded.id);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    const accessToken = jwt.sign({ id: user._id }, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpires,
    });
    return { accessToken };
  }

  logout() {
    return { message: 'Sesion cerrada' };
  }

  async forgotPassword({ email }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('No existe una cuenta con ese email', 404);
    }

    const resetToken = jwt.sign({ id: user._id }, config.jwt.accessSecret, {
      expiresIn: '15m',
    });

    if (config.nodeEnv === 'development') {
      logger.info(`Token de recuperacion para ${email}: ${resetToken}`);
    }

    return { resetToken };
  }

  async resetPassword({ token, newPassword }) {
    const decoded = jwt.verify(token, config.jwt.accessSecret);
    const user = await this.userRepository.updateById(decoded.id, { password: newPassword });
    if (!user) {
      throw new AppError('Token invalido o usuario no encontrado', 400);
    }

    return { message: 'Contrasena actualizada' };
  }
}
