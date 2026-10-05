const Usuario = require('./usuario.model');
const LoginAttempt = require('./login-attempt.model');
const AuditEvent = require('./audit-event.model');


Usuario.hasMany(LoginAttempt, {
  foreignKey: 'usuarioId',
  as: 'loginAttempts'
});

LoginAttempt.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario'
});


Usuario.hasMany(AuditEvent, {
  foreignKey: 'usuarioId',
  as: 'auditEvents'
});

AuditEvent.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario'
});


module.exports = {
  Usuario,
  LoginAttempt,
  AuditEvent
};
