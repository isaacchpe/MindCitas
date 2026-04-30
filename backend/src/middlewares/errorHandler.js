import { config } from '../config/env.js';
import { logger } from '../config/logger.js';

const handleValidationError = (err) => ({
  statusCode: 400,
  message: `Error de validacion: ${Object.values(err.errors)
    .map((e) => e.message)
    .join(', ')}`,
});

const handleCastError = (err) => ({
  statusCode: 400,
  message: `Valor invalido para ${err.path}: ${err.value}`,
});

const handleDuplicateKey = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return {
    statusCode: 409,
    message: `El valor de '${field}' ya existe`,
  };
};

const handleJwtError = () => ({
  statusCode: 401,
  message: 'Token invalido',
});

const handleJwtExpired = () => ({
  statusCode: 401,
  message: 'Token expirado',
});

export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';

  if (err.name === 'ValidationError') {
    ({ statusCode, message } = handleValidationError(err));
  } else if (err.name === 'CastError') {
    ({ statusCode, message } = handleCastError(err));
  } else if (err.code === 11000) {
    ({ statusCode, message } = handleDuplicateKey(err));
  } else if (err.name === 'JsonWebTokenError') {
    ({ statusCode, message } = handleJwtError());
  } else if (err.name === 'TokenExpiredError') {
    ({ statusCode, message } = handleJwtExpired());
  }

  if (statusCode === 500) {
    logger.error(err);
  }

  const response = {
    status: 'error',
    message,
  };

  if (config.nodeEnv === 'development' && statusCode === 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
