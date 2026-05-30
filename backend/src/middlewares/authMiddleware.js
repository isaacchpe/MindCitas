import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export const authMiddleware = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError('Acceso no autorizado', 401);
  }

  const token = header.split(' ')[1];
  const decoded = jwt.verify(token, config.jwt.accessSecret);
  req.user = { id: decoded.id, role: decoded.role || 'student' };
  next();
};
