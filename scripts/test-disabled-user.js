const authService =
  require('../src/services/auth.service');

const {
  sequelize
} = require(
  '../src/infrastructure/database/sequelize'
);


async function run() {

  try {

    await authService.login({
      username: 'usuario_api',
      password: '***REMOVED-CREDENTIAL***'
    });


    console.log(
      'ERROR: usuario deshabilitado autenticado'
    );

  } catch (error) {

    console.log(
      '=== PRUEBA CUENTA DESHABILITADA ==='
    );

    console.log(
      `Codigo: ${error.code}`
    );

    console.log(
      `Mensaje: ${error.message}`
    );

    console.log(
      'Acceso rechazado correctamente'
    );

  } finally {

    await sequelize.close();

  }
}


run();
