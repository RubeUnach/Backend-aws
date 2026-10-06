const {
  generateAccessToken,
  verifyAccessToken
} = require(
  '../src/infrastructure/jwt/jwt.service'
);


function run() {
  try {
    console.log(
      '=== PRUEBA JWT SERVICE ==='
    );


    const token =
      generateAccessToken({
        id: 4,
        username: 'usuario_api',
        role: 'user'
      });


    console.log(
      `Token generado: ${token.substring(0, 30)}...`
    );


    console.log(
      `Partes JWT: ${token.split('.').length}`
    );


    const payload =
      verifyAccessToken(token);


    console.log('\nTOKEN VALIDO');

    console.log({
      sub: payload.sub,
      username: payload.username,
      role: payload.role,
      issuer: payload.iss,
      audience: payload.aud
    });


    try {
      verifyAccessToken(
        `${token}MODIFICADO`
      );

      console.log(
        'ERROR: token alterado aceptado'
      );

    } catch (error) {

      console.log('\nTOKEN ALTERADO RECHAZADO');

      console.log(
        `Error JWT: ${error.name}`
      );
    }


    console.log(
      '\n=== JWT SERVICE FUNCIONANDO ==='
    );

  } catch (error) {

    console.error(
      'ERROR JWT SERVICE'
    );

    console.error(error);

    process.exitCode = 1;
  }
}


run();
