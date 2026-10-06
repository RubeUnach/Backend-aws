const {
  LoginAttempt
} = require(
  '../infrastructure/database/models'
);


async function create({
  usuarioId = null,
  usernameAttempted = null,
  ipAddress,
  success,
  failureReason = null,
  userAgent = null
}) {
  return LoginAttempt.create({
    usuarioId,
    usernameAttempted,
    ipAddress,
    success,
    failureReason,
    userAgent
  });
}


async function findRecentByUsername(
  usernameAttempted,
  limit = 20
) {
  return LoginAttempt.findAll({
    where: {
      usernameAttempted
    },

    order: [
      ['createdAt', 'DESC']
    ],

    limit
  });
}


module.exports = {
  create,
  findRecentByUsername
};
