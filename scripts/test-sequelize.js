const {
  testSequelizeConnection,
  sequelize
} = require(
  '../src/infrastructure/database/sequelize'
);

const Usuario = require(
  '../src/infrastructure/database/models/usuario.model'
);

async function run() {
  try {
    console.log('=== PRUEBA SEQUELIZE ===');

    const database =
      await testSequelizeConnection();

    console.log(
      `Base de datos: ${database.current_database}`
    );

    console.log(
      `Usuario PostgreSQL: ${database.current_user}`
    );

    const usuarios =
      await Usuario.findAll({
        attributes: [
          'id',
          'username',
          'email',
          'role',
          'active'
        ]
      });

    console.log(
      `Usuarios encontrados: ${usuarios.length}`
    );

    console.log('ORM Sequelize funcionando');

  } catch (error) {
    console.error('ERROR SEQUELIZE');
    console.error(error.message);

    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

run();
