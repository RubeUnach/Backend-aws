const usuarioRepository =
  require('../src/repositories/usuario.repository');

const {
  sequelize
} = require(
  '../src/infrastructure/database/sequelize'
);


async function run() {
  const timestamp = Date.now();

  const username =
    `repo_test_${timestamp}`;

  const email =
    `repo_test_${timestamp}@example.local`;

  try {
    console.log(
      '=== PRUEBA USUARIO REPOSITORY CON SEQUELIZE ==='
    );


    const created =
      await usuarioRepository.create({
        username,
        email,
        passwordHash: 'HASH_TEMPORAL_REPOSITORY',
        role: 'user'
      });


    console.log('\nCREATE OK');

    console.log({
      id: created.id,
      username: created.username,
      email: created.email,
      role: created.role,
      active: created.active
    });


    const found =
      await usuarioRepository.findByUsername(
        username
      );


    console.log('\nFIND BY USERNAME OK');

    console.log({
      id: found.id,
      username: found.username,
      role: found.role
    });


    const updated =
      await usuarioRepository.update(
        created.id,
        {
          email:
            `updated_${email}`,
          role: 'admin'
        }
      );


    console.log('\nUPDATE OK');

    console.log({
      id: updated.id,
      email: updated.email,
      role: updated.role
    });


    const disabled =
      await usuarioRepository.setActive(
        created.id,
        false
      );


    console.log('\nSET ACTIVE OK');

    console.log({
      id: disabled.id,
      active: disabled.active
    });


    const users =
      await usuarioRepository.findAll();


    console.log('\nFIND ALL OK');

    console.log(
      `Usuarios encontrados: ${users.length}`
    );


    console.log(
      '\n=== REPOSITORY ORM FUNCIONANDO ==='
    );

  } catch (error) {

    console.error(
      '\nERROR EN USUARIO REPOSITORY'
    );

    console.error(error);

    process.exitCode = 1;

  } finally {

    await sequelize.close();

  }
}


run();
