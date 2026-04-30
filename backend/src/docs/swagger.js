import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '../config/env.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MindCitas API',
      version: '0.2.0',
      description: 'API REST de la plataforma de bienestar emocional MindCitas',
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api`,
      },
    ],
    tags: [
      { name: 'Auth', description: 'Autenticacion y gestion de usuarios' },
      { name: 'EmotionalEntries', description: 'Registro diario de estado emocional' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            academicProgram: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'ok' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
              },
            },
          },
        },
        EmotionalEntry: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            mood: { type: 'integer', minimum: 1, maximum: 5 },
            note: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        WeeklyTrendItem: {
          type: 'object',
          properties: {
            date: { type: 'string', format: 'date-time' },
            mood: { type: 'integer', nullable: true },
            note: { type: 'string', nullable: true },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string' },
          },
        },
      },
    },
    security: [],
  },
  apis: ['./src/modules/**/*.routes.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
