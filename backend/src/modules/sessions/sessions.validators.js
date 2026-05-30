import { body, query } from 'express-validator';

export const createSessionValidator = [
  body('professionalId').notEmpty().withMessage('El profesional es obligatorio'),
  body('sessionType')
    .notEmpty()
    .withMessage('El tipo de sesion es obligatorio')
    .isIn(['psychology', 'mindfulness', 'academic', 'group'])
    .withMessage('Tipo de sesion no valido'),
  body('scheduledAt')
    .notEmpty()
    .withMessage('La fecha es obligatoria')
    .isISO8601()
    .withMessage('La fecha debe estar en formato ISO 8601'),
];

export const rescheduleValidator = [
  body('scheduledAt')
    .notEmpty()
    .withMessage('La nueva fecha es obligatoria')
    .isISO8601()
    .withMessage('La fecha debe estar en formato ISO 8601'),
];

export const availableSlotsValidator = [
  query('date')
    .notEmpty()
    .withMessage('La fecha es obligatoria')
    .isISO8601()
    .withMessage('La fecha debe estar en formato YYYY-MM-DD'),
  query('sessionType')
    .notEmpty()
    .withMessage('El tipo de sesion es obligatorio')
    .isIn(['psychology', 'mindfulness', 'academic', 'group'])
    .withMessage('Tipo de sesion no valido'),
];
