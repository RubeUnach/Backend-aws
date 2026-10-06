const { LoginAttempt } = require('../infrastructure/database/models');
const { Op } = require('sequelize');


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

async function findFailedByIpSince(
  ipAddress,
  since,
  limit = 20
) {
  return LoginAttempt.findAll({
    where: {
      ipAddress,
      success: false,

      createdAt: {
        [Op.gte]: since
      }
    },

    order: [
      ['createdAt', 'DESC']
    ],

    limit
  });
}

module.exports = {
  create,
  findRecentByUsername,
  findFailedByIpSince
};