import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

process.env.PORT = process.env.PORT || '3000';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mindcitas';
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'export';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'export';
process.env.JWT_ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';
process.env.JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';
process.env.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const { swaggerSpec } = await import('../src/docs/swagger.js');

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, '..', 'swagger.json');

writeFileSync(outPath, JSON.stringify(swaggerSpec, null, 2));
console.log(
  `swagger.json generado (${Math.round(Buffer.byteLength(JSON.stringify(swaggerSpec, null, 2)) / 1024)}KB) en ${outPath}`
);
