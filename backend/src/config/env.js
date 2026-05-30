import 'dotenv/config';

const required = [
  'PORT',
  'MONGODB_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_ACCESS_EXPIRES',
  'JWT_REFRESH_EXPIRES',
  'CLIENT_URL',
  'NODE_ENV',
];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`Variable de entorno requerida no definida: ${key}`);
    process.exit(1);
  }
}

export const config = {
  port: Number.parseInt(process.env.PORT, 10),
  nodeEnv: process.env.NODE_ENV,
  mongodbUri: process.env.MONGODB_URI,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpires: process.env.JWT_ACCESS_EXPIRES,
    refreshExpires: process.env.JWT_REFRESH_EXPIRES,
  },
  clientUrl: process.env.CLIENT_URL,
};
