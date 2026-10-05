function normalizeText(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}


function loginDto(body = {}) {
  const username =
    normalizeText(body.username);

  const password =
    typeof body.password === 'string'
      ? body.password
      : '';


  const errors = [];


  if (!username) {
    errors.push(
      'El nombre de usuario es obligatorio'
    );
  }


  if (!password) {
    errors.push(
      'La contraseña es obligatoria'
    );
  }


  return {
    valid: errors.length === 0,
    errors,

    data: {
      username,
      password
    }
  };
}


module.exports = {
  loginDto
};
