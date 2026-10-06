const usuarioRepository =
  require('../repositories/usuario.repository');

const loginAttemptRepository =
  require('../repositories/login-attempt.repository');

const auditRepository =
  require('../repositories/audit.repository');

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


/*
 * Evita que datos controlados por el usuario
 * inserten saltos de línea dentro de los logs.
 */
function sanitizeLogValue(value) {
  return String(value ?? '')
    .replace(/[\r\n\t]/g, '_')
    .slice(0, 150);
}


async function registerFailedAttempt({
  usuario = null,
  username,
  ipAddress,
  userAgent,
  reason
}) {

  await loginAttemptRepository.create({
    usuarioId:
      usuario ? usuario.id : null,

    usernameAttempted:
      username,

    ipAddress,

    success:
      false,

    failureReason:
      reason,

    userAgent
  });


  await auditRepository.create({
    usuarioId:
      usuario ? usuario.id : null,

    action:
      reason === 'ACCOUNT_DISABLED'
        ? 'LOGIN_DENIED'
        : 'LOGIN_FAILED',

    resource:
      '/api/auth/login',

    httpMethod:
      'POST',

    ipAddress,

    userAgent,

    status:
      reason === 'ACCOUNT_DISABLED'
        ? 'DENIED'
        : 'FAILED',

    details: {
      reason,
      usernameAttempted:
        username
    }
  });


  console.warn(
    `[AUTH_FAILURE] ip=${sanitizeLogValue(ipAddress)} ` +
    `username=${sanitizeLogValue(username)} ` +
    `reason=${sanitizeLogValue(reason)}`
  );
}


async function registerSuccessfulAttempt({
  usuario,
  username,
  ipAddress,
  userAgent
}) {

  await loginAttemptRepository.create({
    usuarioId:
      usuario.id,

    usernameAttempted:
      username,

    ipAddress,

    success:
      true,

    failureReason:
      null,

    userAgent
  });


  await auditRepository.create({
    usuarioId:
      usuario.id,

    action:
      'LOGIN_SUCCESS',

    resource:
      '/api/auth/login',

    httpMethod:
      'POST',

    ipAddress,

    userAgent,

    status:
      'SUCCESS',

    details: {
      usernameAttempted:
        username
    }
  });


  console.info(
    `[AUTH_SUCCESS] ip=${sanitizeLogValue(ipAddress)} ` +
    `username=${sanitizeLogValue(username)}`
  );
}


async function login(
  {
    username,
    password
  },
  {
    ipAddress = '0.0.0.0',
    userAgent = 'unknown'
  } = {}
) {

  const usuario =
    await usuarioRepository.findByUsername(
      username
    );


  /*
   * Usuario inexistente.
   *
   * Externamente no revelamos si existe.
   */
  if (!usuario) {

    await registerFailedAttempt({
      usuario: null,
      username,
      ipAddress,
      userAgent,
      reason:
        'INVALID_CREDENTIALS'
    });


    throw createAuthError(
      'INVALID_CREDENTIALS',
      'Credenciales incorrectas'
    );
  }


  /*
   * Verificamos primero la contraseña.
   *
   * Así una contraseña incorrecta de una cuenta
   * deshabilitada no revela el estado de la cuenta.
   */
  const passwordValid =
    await verifyPassword(
      password,
      usuario.passwordHash
    );


  if (!passwordValid) {

    await registerFailedAttempt({
      usuario,
      username,
      ipAddress,
      userAgent,
      reason:
        'INVALID_CREDENTIALS'
    });


    throw createAuthError(
      'INVALID_CREDENTIALS',
      'Credenciales incorrectas'
    );
  }


  /*
   * La contraseña es correcta,
   * pero la cuenta puede haber perdido acceso.
   */
  if (!usuario.active) {

    await registerFailedAttempt({
      usuario,
      username,
      ipAddress,
      userAgent,
      reason:
        'ACCOUNT_DISABLED'
    });


    throw createAuthError(
      'ACCOUNT_DISABLED',
      'La cuenta no se encuentra disponible'
    );
  }


  await registerSuccessfulAttempt({
    usuario,
    username,
    ipAddress,
    userAgent
  });


  const token =
    generateAccessToken({
      id:
        usuario.id,

      username:
        usuario.username,

      role:
        usuario.role
    });


  return {
    token,

    tokenType:
      'Bearer',

    user: {
      id:
        usuario.id,

      username:
        usuario.username,

      email:
        usuario.email,

      role:
        usuario.role,

      active:
        usuario.active
    }
  };
}


module.exports = {
  login
};