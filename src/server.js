const app = require('./app');
const env = require('./config/env');

const {
  testSequelizeConnection
} = require('./infrastructure/database/sequelize');


async function startServer() {
  try {
    const database =
      await testSequelizeConnection();

    console.log(
      `Base de datos conectada: ${database.current_database}`
    );

    console.log(
      `Usuario PostgreSQL: ${database.current_user}`
    );

    app.listen(env.port, '0.0.0.0', () => {
      console.log(
        `Servidor ejecutándose en el puerto ${env.port}`
      );
    });

  } catch (error) {
    console.error(
      'No fue posible conectar con PostgreSQL:',
      error.message
    );

    process.exit(1);
  }
}

startServer();
