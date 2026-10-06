require('dotenv').config();

const requiredEnvVars = [
  'PORT',
  'JWT_SECRET',
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'BCRYPT_ROUNDS',
  'FRONTEND_ORIGIN',
  'LOGIN_MAX_FAILED_ATTEMPTS',
  'LOGIN_BLOCK_WINDOW_MINUTES',
  'LOGIN_BLOCK_MINUTES',
  'TRUST_PROXY'
];

for (const variable of requiredEnvVars) {
  if (!process.env[variable]) {
    throw new Error(
      `Variable de entorno requerida no definida: ${variable}`
    );
  }
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',

  port: Number(process.env.PORT) || 3000,

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m'
  },
  security: {
    bcryptRounds:
        Number(process.env.BCRYPT_ROUNDS) || 12
  },

  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },
  frontend: {
    origin: process.env.FRONTEND_ORIGIN
  },
  auth: {
    maxFailedAttempts:
      Number(process.env.LOGIN_MAX_FAILED_ATTEMPTS) || 3,

    blockWindowMinutes:
      Number(process.env.LOGIN_BLOCK_WINDOW_MINUTES) || 10,

    blockMinutes:
      Number(process.env.LOGIN_BLOCK_MINUTES) || 5
  },
  proxy: {
    trust:
      process.env.TRUST_PROXY
  },
};

module.exports = env;