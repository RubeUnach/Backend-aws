const {
  DataTypes
} = require('sequelize');

const {
  sequelize
} = require('../sequelize');

const AuditEvent = sequelize.define(
  'AuditEvent',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },

    usuarioId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'usuario_id'
    },

    action: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    resource: {
      type: DataTypes.STRING(150),
      allowNull: true
    },

    httpMethod: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'http_method'
    },

    ipAddress: {
      type: DataTypes.INET,
      allowNull: true,
      field: 'ip_address'
    },

    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'user_agent'
    },

    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'SUCCESS'
    },

    details: {
      type: DataTypes.JSONB,
      allowNull: true
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    }
  },
  {
    tableName: 'audit_events',
    schema: 'app',
    timestamps: false
  }
);

module.exports = AuditEvent;
