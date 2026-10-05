const {
  DataTypes
} = require('sequelize');

const {
  sequelize
} = require('../sequelize');

const LoginAttempt = sequelize.define(
  'LoginAttempt',
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

    usernameAttempted: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: 'username_attempted'
    },

    ipAddress: {
      type: DataTypes.INET,
      allowNull: false,
      field: 'ip_address'
    },

    success: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },

    failureReason: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'failure_reason'
    },

    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'user_agent'
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    }
  },
  {
    tableName: 'login_attempts',
    schema: 'app',
    timestamps: false
  }
);

module.exports = LoginAttempt;
