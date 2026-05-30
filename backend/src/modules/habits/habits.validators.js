import { body } from 'express-validator';

export const createHabitValidator = [
  body('habitType')
    .notEmpty()
    .withMessage('El tipo de habito es obligatorio')
    .isIn(['meditation', 'exercise', 'reading', 'hydration', 'sleep', 'custom'])
    .withMessage('Tipo de habito no valido'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('El nombre debe tener entre 2 y 60 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('La descripcion no puede exceder 200 caracteres'),
];
