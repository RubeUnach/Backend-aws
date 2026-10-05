const usuarioService =
  require('../src/services/usuario.service');

const {
  Usuario
} = require(
  '../src/infrastructure/database/models'
);

const {
  sequelize
} = require(
  '../src/infrastructure/database/sequelize'
);


async function run() {
  const timestamp = Date.now();

  const username =
    `service_test_${timestamp}`;

  const email =
    `service_test_${timestamp}@example.local`;

  const password =
    'ClaveSegura_Test_2026!';


  try {

    console.log(
      '=== PRUEBA USUARIO SERVICE ==='
    );


    // ----------------------------------
    // CREAR USUARIO
    // ----------------------------------

    const created =
      await usuarioService.createUser({
        username,
        email,
        password,
        role: 'user'
      });


    console.log('\nCREATE USER OK');

    console.log({
      id: created.id,
      username: created.username,
      email: created.email,
      role: created.role,
      active: created.active
    });


    // ----------------------------------
    // COMPROBAR HASH EN BD
    // ----------------------------------

    const stored =
      await Usuario.findOne({
        where: {
          username
        }
      });


    console.log('\nPASSWORD SECURITY OK');

    console.log(
      `Password almacenado como hash: ${
        stored.passwordHash.startsWith('$2')
      }`
    );

    console.log(
      `Hash bcrypt longitud: ${
        stored.passwordHash.length
      }`
    );


    // ----------------------------------
    // COMPROBAR QUE EL SERVICE
    // NO EXPONE passwordHash
    // ----------------------------------

    console.log('\nPASSWORD EXPOSURE CHECK');

    console.log(
      `passwordHash expuesto: ${
        created.passwordHash !== undefined
      }`
    );


    // ----------------------------------
    // PROBAR DUPLICADO
    // ----------------------------------

    try {

      await usuarioService.createUser({
        username,
        email:
          `otro_${email}`,
        password,
        role: 'user'
      });

      console.log(
        'ERROR: duplicado permitido'
      );

    } catch (error) {

      console.log('\nDUPLICATE CHECK OK');

      console.log(
        `Codigo: ${error.code}`
      );

    }


    // ----------------------------------
    // DESACTIVAR
    // ----------------------------------

    const disabled =
      await usuarioService.setUserActive(
        created.id,
        false
      );


    console.log('\nDISABLE USER OK');

    console.log({
      id: disabled.id,
      active: disabled.active
    });


    console.log(
      '\n=== USUARIO SERVICE FUNCIONANDO ==='
    );


  } catch (error) {

    console.error(
      '\nERROR USUARIO SERVICE'
    );

    console.error(error);

    process.exitCode = 1;

  } finally {

    await sequelize.close();

  }
}


run();
