import { body } from 'express-validator';

export const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 80 })
    .withMessage('El nombre debe tener entre 2 y 80 caracteres'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('El email no es válido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres'),
  body('academicProgram')
    .optional()
    .trim()
    .isLength({ max: 120 })
    .withMessage('El programa académico no puede exceder 120 caracteres'),
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('El email no es válido')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
];

export const refreshValidator = [
  body('refreshToken').notEmpty().withMessage('El refresh token es obligatorio'),
];

export const forgotPasswordValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('El email no es válido')
    .normalizeEmail(),
];

export const resetPasswordValidator = [
  body('token').notEmpty().withMessage('El token es obligatorio'),
  body('newPassword')
    .notEmpty()
    .withMessage('La nueva contraseña es obligatoria')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres'),
];
