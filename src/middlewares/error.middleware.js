function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: 'El recurso solicitado no existe'
  });
}


function errorHandler(error, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}`,error.message);

  const serviceErrors = {
    USERNAME_ALREADY_EXISTS: 409,
    EMAIL_ALREADY_EXISTS: 409,
    USER_NOT_FOUND: 404,
    INVALID_CREDENTIALS: 401,
    ACCOUNT_DISABLED: 403,
    IP_TEMPORARILY_BLOCKED: 429
  };


  if (error.code && serviceErrors[error.code]) {
    if (error.code === 'IP_TEMPORARILY_BLOCKED' && error.retryAfter) 
      res.set('Retry-After', String(error.retryAfter));

    return res.status(serviceErrors[error.code]).json({
      success: false,
      error: error.code,
      message: error.message
    });
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      error: 'RESOURCE_ALREADY_EXISTS',
      message: 'El recurso ya se encuentra registrado'
    });
  }


  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      error: 'DATABASE_VALIDATION_ERROR',
      message: 'Los datos no cumplen las restricciones requeridas'
    });
  }

  if (error.code === 'CORS_NOT_ALLOWED') {
    return res.status(403).json({
      success: false,
      error: 'CORS_NOT_ALLOWED',
      message: 'El origen de la solicitud no está permitido'
    });
  }

  if (error.type === 'entity.too.large' || error.status === 413) {
    return res.status(413).json({
      success: false,
      error: 'PAYLOAD_TOO_LARGE',
      message: 'El cuerpo de la solicitud excede el tamaño permitido'
    });
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_JSON',
      message: 'El cuerpo de la solicitud contiene JSON inválido'
    });
  }

  return res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Ocurrió un error interno en el servidor'
  });
}


module.exports = {
  notFoundHandler,
  errorHandler
};
