const {
  sequelize,
  testSequelizeConnection
} = require(
  '../src/infrastructure/database/sequelize'
);

const {
  Usuario,
  LoginAttempt,
  AuditEvent
} = require(
  '../src/infrastructure/database/models'
);


async function run() {
  try {
    console.log(
      '=== PRUEBA DE MODELOS SEQUELIZE ==='
    );

    const database =
      await testSequelizeConnection();

    console.log(
      `Base de datos: ${database.current_database}`
    );

    console.log(
      `Usuario PostgreSQL: ${database.current_user}`
    );


    const usuarios =
      await Usuario.count();

    const loginAttempts =
      await LoginAttempt.count();

    const auditEvents =
      await AuditEvent.count();


    console.log(
      `Usuarios: ${usuarios}`
    );

    console.log(
      `Intentos de login: ${loginAttempts}`
    );

    console.log(
      `Eventos de auditoria: ${auditEvents}`
    );


    console.log(
      'Relacion Usuario -> LoginAttempt: OK'
    );

    console.log(
      'Relacion Usuario -> AuditEvent: OK'
    );


    console.log(
      '=== MODELOS ORM FUNCIONANDO ==='
    );

  } catch (error) {
    console.error(
      'ERROR EN MODELOS SEQUELIZE'
    );

    console.error(error);

    process.exitCode = 1;

  } finally {
    await sequelize.close();
  }
}

run();
