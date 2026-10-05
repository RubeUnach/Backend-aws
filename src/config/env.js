require('dotenv').config();

const requiredEnvVars = [
  'PORT',
  'JWT_SECRET',
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'BCRYPT_ROUNDS'
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
  }
};

module.exports = env;