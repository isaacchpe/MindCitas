import { AppError } from '../utils/AppError.js';

export const requireRole = (roles) => (req, _res, next) => {
  if (!req.user) {
    throw new AppError('Acceso no autorizado', 401);
  }
  if (!roles.includes(req.user.role)) {
    throw new AppError('Acceso restringido a administradores', 403);
  }
  next();
};
