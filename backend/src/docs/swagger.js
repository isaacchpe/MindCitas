import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '../config/env.js';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'MindCitas API',
      version: '1.0.0',
      description:
        'API REST de la plataforma de bienestar emocional MindCitas para estudiantes universitarios colombianos',
    },
    servers: [
      { url: `http://localhost:${config.port}/api`, description: 'Desarrollo local' },
      { url: 'https://mindcitas-api.onrender.com/api', description: 'Produccion (Render)' },
    ],
    tags: [
      { name: 'Auth', description: 'Autenticacion y gestion de credenciales' },
      { name: 'Users', description: 'Perfil de usuario e insignias' },
      { name: 'EmotionalEntries', description: 'Registro diario de estado emocional' },
      { name: 'Habits', description: 'Micro-habitos, rachas e insignias' },
      { name: 'Sessions', description: 'Agendamiento de sesiones de apoyo' },
      { name: 'Admin', description: 'Administracion de la plataforma' },
      { name: 'Badges', description: 'Catalogo de insignias' },
      { name: 'Health', description: 'Estado del servicio' },
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
            role: { type: 'string', enum: ['student', 'professional', 'admin'] },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        UserProfile: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            email: { type: 'string' },
            fullName: { type: 'string' },
            program: { type: 'string', nullable: true },
            role: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
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
        Habit: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            habitType: {
              type: 'string',
              enum: ['meditation', 'exercise', 'reading', 'hydration', 'sleep', 'custom'],
            },
            name: { type: 'string' },
            description: { type: 'string' },
            frequency: { type: 'string' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        HabitSummary: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            habitType: { type: 'string' },
            currentStreak: { type: 'integer' },
            bestStreak: { type: 'integer' },
            completedToday: { type: 'boolean' },
          },
        },
        HabitLog: {
          type: 'object',
          properties: {
            habitId: { type: 'string' },
            weekStart: { type: 'string', format: 'date-time' },
            entries: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  dayOfWeek: { type: 'integer', minimum: 0, maximum: 6 },
                  completedAt: { type: 'string', format: 'date-time' },
                },
              },
            },
            currentStreak: { type: 'integer' },
            bestStreak: { type: 'integer' },
          },
        },
        Badge: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            code: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            threshold: { type: 'integer' },
          },
        },
        UserBadge: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            badgeId: { $ref: '#/components/schemas/Badge' },
            habitId: { type: 'string' },
            awardedAt: { type: 'string', format: 'date-time' },
          },
        },
        Professional: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            fullName: { type: 'string' },
            specialty: {
              type: 'string',
              enum: ['psychology', 'mindfulness', 'academic', 'group'],
            },
            isActive: { type: 'boolean' },
          },
        },
        SessionType: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            name: { type: 'string' },
            durationMinutes: { type: 'integer' },
            description: { type: 'string' },
          },
        },
        Session: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            userSnapshot: {
              type: 'object',
              properties: {
                fullName: { type: 'string' },
                program: { type: 'string' },
              },
            },
            professionalId: { $ref: '#/components/schemas/Professional' },
            sessionType: { type: 'string' },
            scheduledAt: { type: 'string', format: 'date-time' },
            status: {
              type: 'string',
              enum: ['scheduled', 'completed', 'canceled', 'no_show'],
            },
            confirmationCode: { type: 'string', example: 'MC-A1B2C3' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string' },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'El nombre es obligatorio, El email no es valido' },
          },
        },
      },
    },
    security: [],
  },
  apis: ['./src/modules/**/*.routes.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
