const {
  createUsuarioDto
} = require(
  '../src/dto/usuario.dto'
);


function printResult(
  title,
  dto
) {
  console.log(`\n${title}`);

  console.log(
    `Valido: ${dto.valid}`
  );

  console.log(
    `Errores: ${dto.errors.length}`
  );

  if (dto.errors.length > 0) {
    console.log(dto.errors);
  }
}


console.log(
  '=== PRUEBA USUARIO DTO ==='
);


const valid =
  createUsuarioDto({
    username: 'usuario_seguro',
    email: 'usuario@ejemplo.com',
    password: 'ExampleOnly_2026!',
    role: 'user'
  });


printResult(
  'CASO VALIDO',
  valid
);


const shortPassword =
  createUsuarioDto({
    username: 'usuario2',
    email: 'usuario2@ejemplo.com',
    password: '123',
    role: 'user'
  });


printResult(
  'PASSWORD INVALIDO',
  shortPassword
);


const invalidEmail =
  createUsuarioDto({
    username: 'usuario3',
    email: 'correo-invalido',
    password: 'ExampleOnly_2026!',
    role: 'user'
  });


printResult(
  'EMAIL INVALIDO',
  invalidEmail
);


const invalidRole =
  createUsuarioDto({
    username: 'usuario4',
    email: 'usuario4@ejemplo.com',
    password: 'ExampleOnly_2026!',
    role: 'superadmin'
  });


printResult(
  'ROL INVALIDO',
  invalidRole
);


const invalidUsername =
  createUsuarioDto({
    username: 'us@rio!',
    email: 'usuario5@ejemplo.com',
    password: 'ExampleOnly_2026!',
    role: 'user'
  });


printResult(
  'USERNAME INVALIDO',
  invalidUsername
);


console.log(
  '\n=== DTO FUNCIONANDO ==='
);
