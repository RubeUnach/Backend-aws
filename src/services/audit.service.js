const auditRepository =
  require('../repositories/audit.repository');


async function record({
  usuarioId = null,
  action,
  resource = null,
  httpMethod = null,
  ipAddress = null,
  userAgent = null,
  status = 'SUCCESS',
  details = null
}) {

  try {

    return await auditRepository.create({
      usuarioId,
      action,
      resource,
      httpMethod,
      ipAddress,
      userAgent,
      status,
      details
    });

  } catch (error) {

    /*
     * La auditoría no debe exponer detalles
     * internos al cliente HTTP.
     */
    console.error(
      `[AUDIT_ERROR] action=${action}`,
      error.message
    );

    return null;
  }
}


module.exports = {
  record
};
