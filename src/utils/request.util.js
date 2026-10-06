function getClientIp(req) {

  let ip =
    req.ip ||
    req.socket?.remoteAddress ||
    '0.0.0.0';


  if (
    typeof ip === 'string' &&
    ip.startsWith('::ffff:')
  ) {
    ip =
      ip.substring(7);
  }


  return ip;
}


function getRequestContext(req) {

  return {
    ipAddress:
      getClientIp(req),

    userAgent:
      req.get('user-agent') ||
      'unknown',

    httpMethod:
      req.method
  };
}


module.exports = {
  getClientIp,
  getRequestContext
};
