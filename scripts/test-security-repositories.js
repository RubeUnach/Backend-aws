const usuarioRepository =
  require(
    '../src/repositories/usuario.repository'
  );

const loginAttemptRepository =
  require(
    '../src/repositories/login-attempt.repository'
  );

const auditRepository =
  require(
    '../src/repositories/audit.repository'
  );

const {
  sequelize
} = require(
  '../src/infrastructure/database/sequelize'
);


async function run() {
  try {

    console.log(
      '=== PRUEBA REPOSITORIES DE SEGURIDAD ==='
    );


    const usuario =
      await usuarioRepository.findByUsername(
        'usuario_api'
      );


    if (!usuario) {
      throw new Error(
        'usuario_api no existe'
      );
    }


    // ====================================
    // LOGIN ATTEMPT EXITOSO
    // ====================================

    const loginAttempt =
      await loginAttemptRepository.create({
        usuarioId: usuario.id,
        usernameAttempted:
          usuario.username,

        ipAddress:
          '127.0.0.1',

        success:
          true,

        failureReason:
          null,

        userAgent:
          'security-repository-test'
      });


    console.log(
      '\nLOGIN ATTEMPT INSERT OK'
    );

    console.log({
      id:
        loginAttempt.id,

      username:
        loginAttempt.usernameAttempted,

      success:
        loginAttempt.success,

      ip:
        loginAttempt.ipAddress
    });


    // ====================================
    // EVENTO DE AUDITORIA
    // ====================================

    const auditEvent =
      await auditRepository.create({
        usuarioId:
          usuario.id,

        action:
          'SECURITY_TEST',

        resource:
          '/api/test',

        httpMethod:
          'GET',

        ipAddress:
          '127.0.0.1',

        userAgent:
          'security-repository-test',

        status:
          'SUCCESS',

        details: {
          source:
            'test-security-repositories'
        }
      });


    console.log(
      '\nAUDIT EVENT INSERT OK'
    );

    console.log({
      id:
        auditEvent.id,

      action:
        auditEvent.action,

      status:
        auditEvent.status,

      resource:
        auditEvent.resource
    });


    console.log(
      '\n=== REPOSITORIES DE SEGURIDAD FUNCIONANDO ==='
    );


  } catch (error) {

    console.error(
      '\nERROR REPOSITORIES DE SEGURIDAD'
    );

    console.error(error);

    process.exitCode = 1;

  } finally {

    await sequelize.close();

  }
}


run();
