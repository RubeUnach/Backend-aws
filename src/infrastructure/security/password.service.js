const bcrypt = require('bcryptjs');
const env = require('../../config/env');

async function hashPassword(password) {
  if (typeof password !== 'string' || password.length === 0) 
    throw new Error('La contraseña es requerida para generar el hash');

  return bcrypt.hash(password, env.security.bcryptRounds);
}

async function verifyPassword(password, passwordHash) {
  if (!password || !passwordHash) 
    return false;

  return bcrypt.compare(password, passwordHash);
}

module.exports = {
  hashPassword,
  verifyPassword
};