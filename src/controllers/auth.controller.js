const authService =
  require('../services/auth.service');


async function login(
  req,
  res,
  next
) {
  try {

    const result =
      await authService.login(
        req.validatedBody,
        {
          ipAddress:
            getClientIp(req),

          userAgent:
            req.get('user-agent') ||
            'unknown'
        }
      );


    return res.status(200).json({
      success: true,
      message:
        'Autenticación correcta',
      data: result
    });

  } catch (error) {

    next(error);

  }
}

function getClientIp(req) {

  let ip =
    req.ip ||
    req.socket?.remoteAddress ||
    '0.0.0.0';


  /*
   * Normalización IPv4 mapeada como IPv6:
   *
   * ::ffff:127.0.0.1
   *          ↓
   * 127.0.0.1
   */
  if (
    ip.startsWith('::ffff:')
  ) {
    ip =
      ip.substring(7);
  }


  return ip;
}

async function me(
  req,
  res
) {

  return res.status(200).json({
    success: true,

    data: {
      id:
        req.authUser.id,

      username:
        req.authUser.username,

      email:
        req.authUser.email,

      role:
        req.authUser.role,

      active:
        req.authUser.active
    }
  });
}


module.exports = {
  login,
  me
};
