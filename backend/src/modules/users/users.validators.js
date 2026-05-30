import { body } from 'express-validator';

export const updateMeValidator = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('El nombre debe tener entre 2 y 80 caracteres'),
  body('program')
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('El programa debe tener entre 2 y 80 caracteres'),
];
