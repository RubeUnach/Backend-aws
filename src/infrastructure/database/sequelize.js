const { Sequelize } = require('sequelize');
const env = require('../../config/env');

const sequelize = new Sequelize(
  env.database.name,
  env.database.user,
  env.database.password,
  {
    host: env.database.host,
    port: env.database.port,
    dialect: 'postgres',

    logging: false,

    pool: {
      max: 10,
      min: 0,
      acquire: 5000,
      idle: 30000
    },

    define: {
      timestamps: false
    }
  }
);

async function testSequelizeConnection() {
  await sequelize.authenticate();

  const [results] = await sequelize.query(`
    SELECT
      current_user,
      current_database()
  `);

  return results[0];
}

module.exports = {
  sequelize,
  testSequelizeConnection
};
