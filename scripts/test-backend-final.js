const BASE_URL =
  process.env.TEST_BASE_URL ||
  'http://localhost:3000';

const USERNAME =
  process.env.TEST_USERNAME;

const PASSWORD =
  process.env.TEST_PASSWORD;


let passed = 0;
let failed = 0;


function pass(name) {
  passed++;
  console.log(`[PASS] ${name}`);
}


function fail(name, detail) {
  failed++;
  console.log(
    `[FAIL] ${name} -> ${detail}`
  );
}


async function expectStatus(
  name,
  response,
  expected
) {
  if (response.status === expected) {
    pass(
      `${name} -> HTTP ${expected}`
    );

    return true;
  }

  fail(
    name,
    `esperado ${expected}, recibido ${response.status}`
  );

  return false;
}


async function run() {

  if (!USERNAME || !PASSWORD) {
    console.error(
      'Debe definir TEST_USERNAME y TEST_PASSWORD'
    );

    process.exit(1);
  }


  console.log(
    '========================================'
  );

  console.log(
    ' PRUEBAS FINALES BACKEND ZERO TRUST'
  );

  console.log(
    '========================================\n'
  );


  // =====================================
  // 1. HEALTH
  // =====================================

  const health =
    await fetch(
      `${BASE_URL}/api/health`
    );

  await expectStatus(
    'Health check',
    health,
    200
  );

  const healthBody =
    await health.json();

  if (
    healthBody.status === 'ok' &&
    healthBody.database === 'ok' &&
    healthBody.persistence === 'sequelize'
  ) {
    pass(
      'Health confirma PostgreSQL + Sequelize'
    );
  } else {
    fail(
      'Health PostgreSQL',
      'respuesta inesperada'
    );
  }


  // =====================================
  // 2. LOGIN
  // =====================================

  const login =
    await fetch(
      `${BASE_URL}/api/auth/login`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json'
        },

        body: JSON.stringify({
          username:
            USERNAME,

          password:
            PASSWORD
        })
      }
    );


  const loginOk =
    await expectStatus(
      'Login válido',
      login,
      200
    );


  if (!loginOk) {
    console.error(
      '\nNo se puede continuar sin JWT.'
    );

    process.exit(1);
  }


  const loginBody =
    await login.json();

  const token =
    loginBody?.data?.token;


  if (
    typeof token === 'string' &&
    token.split('.').length === 3
  ) {
    pass(
      'JWT recibido con formato válido'
    );
  } else {
    fail(
      'JWT',
      'token ausente o inválido'
    );

    process.exit(1);
  }


  // =====================================
  // 3. /ME CON JWT
  // =====================================

  const me =
    await fetch(
      `${BASE_URL}/api/auth/me`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );


  await expectStatus(
    'Recurso protegido con JWT',
    me,
    200
  );


  // =====================================
  // 4. /ME SIN JWT
  // =====================================

  const withoutToken =
    await fetch(
      `${BASE_URL}/api/auth/me`
    );


  await expectStatus(
    'Recurso protegido sin JWT',
    withoutToken,
    401
  );


  // =====================================
  // 5. JWT MANIPULADO
  // =====================================

  const alteredToken =
    await fetch(
      `${BASE_URL}/api/auth/me`,
      {
        headers: {
          Authorization:
            `Bearer ${token}ALTERADO`
        }
      }
    );


  await expectStatus(
    'JWT manipulado',
    alteredToken,
    401
  );


  // =====================================
  // 6. ENDPOINT ADMIN
  // =====================================

  const admin =
    await fetch(
      `${BASE_URL}/api/usuarios`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );


  await expectStatus(
    'Endpoint administrativo',
    admin,
    200
  );


  // =====================================
  // 7. DTO INVALIDO
  // =====================================

  const invalidDto =
    await fetch(
      `${BASE_URL}/api/usuarios`,
      {
        method: 'POST',

        headers: {
          Authorization:
            `Bearer ${token}`,

          'Content-Type':
            'application/json'
        },

        body: JSON.stringify({
          username: '@',
          email: 'correo-invalido',
          password: '123',
          role: 'superadmin'
        })
      }
    );


  await expectStatus(
    'Validación DTO',
    invalidDto,
    400
  );


  // =====================================
  // 8. 404
  // =====================================

  const notFound =
    await fetch(
      `${BASE_URL}/api/recurso-inexistente`
    );


  await expectStatus(
    'Ruta inexistente',
    notFound,
    404
  );


  // =====================================
  // 9. CORS AUTORIZADO
  // =====================================

  const corsAllowed =
    await fetch(
      `${BASE_URL}/api/health`,
      {
        headers: {
          Origin:
            'http://localhost:5173'
        }
      }
    );


  const corsAllowedOk =
    await expectStatus(
      'CORS origen autorizado',
      corsAllowed,
      200
    );


  if (corsAllowedOk) {

    const allowOrigin =
      corsAllowed.headers.get(
        'access-control-allow-origin'
      );


    if (
      allowOrigin ===
      'http://localhost:5173'
    ) {
      pass(
        'CORS devuelve origen específico'
      );
    } else {
      fail(
        'CORS header',
        `valor recibido: ${allowOrigin}`
      );
    }
  }


  // =====================================
  // 10. CORS NO AUTORIZADO
  // =====================================

  const corsDenied =
    await fetch(
      `${BASE_URL}/api/health`,
      {
        headers: {
          Origin:
            'https://sitio-malicioso.example'
        }
      }
    );


  await expectStatus(
    'CORS origen no autorizado',
    corsDenied,
    403
  );


  // =====================================
  // 11. JSON INVALIDO
  // =====================================

  const invalidJson =
    await fetch(
      `${BASE_URL}/api/auth/login`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json'
        },

        body:
          '{"username":"usuario_api"'
      }
    );


  await expectStatus(
    'JSON inválido',
    invalidJson,
    400
  );


  // =====================================
  // 12. PAYLOAD > 10KB
  // =====================================

  const largePayload =
    await fetch(
      `${BASE_URL}/api/auth/login`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json'
        },

        body: JSON.stringify({
          username:
            USERNAME,

          password:
            'A'.repeat(15000)
        })
      }
    );


  await expectStatus(
    'Payload mayor a 10 KB',
    largePayload,
    413
  );


  // =====================================
  // RESULTADO
  // =====================================

  console.log(
    '\n========================================'
  );

  console.log(
    ` RESULTADO: ${passed} PASS / ${failed} FAIL`
  );

  console.log(
    '========================================'
  );


  if (failed > 0) {
    process.exitCode = 1;
  }
}


run().catch((error) => {

  console.error(
    '\n[ERROR GENERAL]',
    error.message
  );

  process.exit(1);

});
