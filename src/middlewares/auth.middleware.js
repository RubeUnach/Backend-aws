const {
  verifyAccessToken
} = require(
  '../infrastructure/jwt/jwt.service'
);

const usuarioRepository =
  require('../repositories/usuario.repository');


async function authenticate(
  req,
  res,
  next
) {
  try {

    const authorization =
      req.headers.authorization;


    if (!authorization) {
      return res.status(401).json({
        success: false,
        error: 'TOKEN_REQUIRED',
        message:
          'Se requiere autenticación'
      });
    }


    const parts =
      authorization.split(' ');


    if (
      parts.length !== 2 ||
      parts[0] !== 'Bearer' ||
      !parts[1]
    ) {
      return res.status(401).json({
        success: false,
        error: 'INVALID_AUTHORIZATION_HEADER',
        message:
          'El encabezado de autorización no es válido'
      });
    }


    const token =
      parts[1];


    let payload;

    try {

      payload =
        verifyAccessToken(token);

    } catch (error) {

      return res.status(401).json({
        success: false,
        error: 'INVALID_TOKEN',
        message:
          'El token no es válido o ha expirado'
      });
    }


    /*
     * Zero Trust:
     * no confiamos únicamente en el token.
     *
     * Confirmamos el usuario nuevamente
     * contra la fuente de datos.
     */
    const usuario =
      await usuarioRepository.findById(
        payload.sub
      );


    if (!usuario) {
      return res.status(401).json({
        success: false,
        error: 'INVALID_TOKEN',
        message:
          'El token no es válido'
      });
    }


    if (!usuario.active) {
      return res.status(403).json({
        success: false,
        error: 'ACCOUNT_DISABLED',
        message:
          'La cuenta no tiene acceso permitido'
      });
    }


    req.auth = {
      userId: usuario.id,
      username: usuario.username,
      role: usuario.role
    };


    req.authUser =
      usuario;


    next();

  } catch (error) {

    next(error);

  }
}


module.exports = {
  authenticate
};
