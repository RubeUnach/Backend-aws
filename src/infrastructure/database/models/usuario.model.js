const {
  DataTypes
} = require('sequelize');

const {
  sequelize
} = require('../sequelize');

const Usuario = sequelize.define(
  'Usuario',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },

    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },

    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash'
    },

    role: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'user'
    },

    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },

    createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  },
  {
    tableName: 'usuarios',
    schema: 'app',
    timestamps: false
  }
);

module.exports = Usuario;
