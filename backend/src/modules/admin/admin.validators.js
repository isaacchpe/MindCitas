import { body } from 'express-validator';

export const toggleUserValidator = [
  body('isActive').isBoolean().withMessage('isActive debe ser un valor booleano'),
];
