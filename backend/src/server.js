import app from './app.js';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { logger } from './config/logger.js';

const start = async () => {
  await connectDB();
  logger.info('Base de datos conectada');

  app.listen(config.port, () => {
    logger.info(`Servidor corriendo en puerto ${config.port} [${config.nodeEnv}]`);
  });
};

try {
  await start();
} catch (err) {
  logger.error('Error al iniciar el servidor:', err);
  process.exit(1);
}
