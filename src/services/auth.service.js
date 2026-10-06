const usuarioRepository =
  require('../repositories/usuario.repository');

const {
  verifyPassword
} = require(
  '../infrastructure/security/password.service'
);

const {
  generateAccessToken
} = require(
  '../infrastructure/jwt/jwt.service'
);


function createAuthError(
  code,
  message
) {
  const error = new Error(message);
  error.code = code;

  return error;
}


async function login({
  username,
  password
}) {

  const usuario =
    await usuarioRepository.findByUsername(
      username
    );


  /*
   * No revelamos si el usuario existe o no.
   * Tanto usuario inexistente como contraseña
   * incorrecta producen el mismo error.
   */
  if (!usuario) {
    throw createAuthError(
      'INVALID_CREDENTIALS',
      'Credenciales incorrectas'
    );
  }


  if (!usuario.active) {
    throw createAuthError(
      'ACCOUNT_DISABLED',
      'La cuenta no se encuentra disponible'
    );
  }


  const passwordValid =
    await verifyPassword(
      password,
      usuario.passwordHash
    );


  if (!passwordValid) {
    throw createAuthError(
      'INVALID_CREDENTIALS',
      'Credenciales incorrectas'
    );
  }


  const token =
    generateAccessToken({
      id: usuario.id,
      username: usuario.username,
      role: usuario.role
    });


  /*
   * Nunca devolvemos passwordHash.
   */
  return {
    token,

    tokenType: 'Bearer',

    user: {
      id: usuario.id,
      username: usuario.username,
      email: usuario.email,
      role: usuario.role,
      active: usuario.active
    }
  };
}


module.exports = {
  login
};
