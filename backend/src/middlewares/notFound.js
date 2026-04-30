import { AppError } from '../utils/AppError.js';

export const notFound = (req, _res, next) => {
  next(new AppError(`Ruta no encontrada: ${req.originalUrl}`, 404));
};
