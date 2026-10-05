const {
  hashPassword,
  verifyPassword
} = require(
  '../src/infrastructure/security/password.service'
);


async function run() {
  try {
    console.log(
      '=== PRUEBA PASSWORD SERVICE ==='
    );

    const password =
      'ClaveSegura_Prueba_2026!';

    const hash =
      await hashPassword(password);

    console.log(
      `Hash generado: ${hash.substring(0, 15)}...`
    );

    console.log(
      `Longitud del hash: ${hash.length}`
    );


    const valid =
      await verifyPassword(
        password,
        hash
      );

    console.log(
      `Contraseña correcta: ${valid}`
    );


    const invalid =
      await verifyPassword(
        'PasswordIncorrecto',
        hash
      );

    console.log(
      `Contraseña incorrecta: ${invalid}`
    );


    console.log(
      '=== PASSWORD SERVICE FUNCIONANDO ==='
    );

  } catch (error) {

    console.error(
      'ERROR PASSWORD SERVICE'
    );

    console.error(error);

    process.exitCode = 1;
  }
}


run();
