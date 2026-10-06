const jwt = require('jsonwebtoken');
const env = require('../../config/env');


function generateAccessToken({id, username, role}) {
  return jwt.sign({ username, role },
    env.jwt.secret,
    {
        subject: String(id),
        expiresIn: env.jwt.expiresIn,
        issuer: 'zero-trust-backend',
        audience: 'zero-trust-frontend'
    }
  );
}


function verifyAccessToken(token) {
  return jwt.verify(
    token,
    env.jwt.secret,
    {
      issuer: 'zero-trust-backend',
      audience: 'zero-trust-frontend'
    }
  );
}


module.exports = {
  generateAccessToken,
  verifyAccessToken
};