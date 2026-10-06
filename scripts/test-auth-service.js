const authService =
  require('../src/services/auth.service');

const {
  sequelize
} = require(
  '../src/infrastructure/database/sequelize'
);


async function run() {

  try {

    console.log(
      '=== PRUEBA AUTH SERVICE ==='
    );


    // ==================================
    // LOGIN CORRECTO
    // ==================================

    const result =
      await authService.login({
        username: 'usuario_api',
        password: '***REMOVED-CREDENTIAL***'
      });


    console.log(
      '\nLOGIN CORRECTO'
    );


    console.log({
      tokenType: result.tokenType,

      tokenPreview:
        `${result.token.substring(0, 25)}...`,

      username:
        result.user.username,

      role:
        result.user.role,

      active:
        result.user.active
    });


    console.log(
      `JWT tiene 3 partes: ${
        result.token.split('.').length === 3
      }`
    );


    console.log(
      `passwordHash expuesto: ${
        result.user.passwordHash !== undefined
      }`
    );


    // ==================================
    // PASSWORD INCORRECTO
    // ==================================

    try {

      await authService.login({
        username: 'usuario_api',
        password: 'PasswordIncorrecto!'
      });


      console.log(
        'ERROR: password incorrecto aceptado'
      );

    } catch (error) {

      console.log(
        '\nPASSWORD INCORRECTO RECHAZADO'
      );

      console.log(
        `Codigo: ${error.code}`
      );

      console.log(
        `Mensaje: ${error.message}`
      );
    }


    // ==================================
    // USUARIO INEXISTENTE
    // ==================================

    try {

      await authService.login({
        username: 'usuario_que_no_existe',
        password: 'PasswordIncorrecto!'
      });


      console.log(
        'ERROR: usuario inexistente aceptado'
      );

    } catch (error) {

      console.log(
        '\nUSUARIO INEXISTENTE RECHAZADO'
      );

      console.log(
        `Codigo: ${error.code}`
      );

      console.log(
        `Mensaje: ${error.message}`
      );
    }


    console.log(
      '\n=== AUTH SERVICE FUNCIONANDO ==='
    );


  } catch (error) {

    console.error(
      '\nERROR AUTH SERVICE'
    );

    console.error(error);

    process.exitCode = 1;

  } finally {

    await sequelize.close();

  }
}


run();
