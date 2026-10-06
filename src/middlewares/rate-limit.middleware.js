const {
  rateLimit
} = require('express-rate-limit');


const loginLimiter = rateLimit({
  windowMs:
    10 * 60 * 1000,

  limit:
    5,

  standardHeaders:
    true,

  legacyHeaders:
    false,

  /*
   * Los logins correctos no consumen
   * permanentemente el contador.
   */
  skipSuccessfulRequests:
    true,

  handler: (
    req,
    res
  ) => {

    console.warn(
      `[RATE_LIMIT] ip=${req.ip} endpoint=${req.originalUrl}`
    );

    return res.status(429).json({
      success: false,

      error:
        'TOO_MANY_LOGIN_ATTEMPTS',

      message:
        'Demasiados intentos de autenticación. Intente nuevamente más tarde.'
    });
  }
});


module.exports = {
  loginLimiter
};
