import { body, param, query } from 'express-validator';

export const registerEntryValidator = [
  body('mood')
    .notEmpty()
    .withMessage('El nivel de animo es obligatorio')
    .isInt({ min: 1, max: 5 })
    .withMessage('El nivel de animo debe ser un entero entre 1 y 5'),
  body('note')
    .optional()
    .isString()
    .withMessage('La nota debe ser texto')
    .isLength({ max: 500 })
    .withMessage('La nota no puede exceder 500 caracteres'),
];

export const getByDateValidator = [
  param('date').isISO8601().withMessage('La fecha debe estar en formato ISO 8601'),
];

export const recentValidator = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 30 })
    .withMessage('El limite debe ser un entero entre 1 y 30'),
];
