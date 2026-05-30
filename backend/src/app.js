import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import { config } from './config/env.js';
import { swaggerSpec } from './docs/swagger.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './modules/auth/auth.routes.js';
import emotionalEntryRoutes from './modules/emotional-entries/emotional-entry.routes.js';
import userRoutes from './modules/users/users.routes.js';
import habitRoutes from './modules/habits/habits.routes.js';
import badgeRoutes from './modules/habits/badges.routes.js';
import sessionRoutes from './modules/sessions/sessions.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import healthRoutes from './modules/health/health.routes.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: config.clientUrl, credentials: true }));

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Demasiadas solicitudes, intenta de nuevo mas tarde' },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Demasiados intentos de autenticacion, intenta de nuevo mas tarde',
  },
});

const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/emotional-entries', emotionalEntryRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/habits', habitRoutes);
apiRouter.use('/badges', badgeRoutes);
apiRouter.use('/sessions', sessionRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/health', healthRoutes);

app.use('/api', globalLimiter, apiRouter);
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { customSiteTitle: 'MindCitas API Docs' })
);

app.use(notFound);
app.use(errorHandler);

export default app;
