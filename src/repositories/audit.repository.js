const {
  AuditEvent
} = require(
  '../infrastructure/database/models'
);


async function create({
  usuarioId = null,
  action,
  resource = null,
  httpMethod = null,
  ipAddress = null,
  userAgent = null,
  status = 'SUCCESS',
  details = null
}) {
  return AuditEvent.create({
    usuarioId,
    action,
    resource,
    httpMethod,
    ipAddress,
    userAgent,
    status,
    details
  });
}


async function findRecentByAction(
  action,
  limit = 20
) {
  return AuditEvent.findAll({
    where: {
      action
    },

    order: [
      ['createdAt', 'DESC']
    ],

    limit
  });
}


module.exports = {
  create,
  findRecentByAction
};
