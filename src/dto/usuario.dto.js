const VALID_ROLES = [
  'admin',
  'user'
];


function normalizeText(value) {
  if (typeof value !== 'string')
    return '';

  return value.trim();
}


function validateUsername(username) {
  const value = normalizeText(username);

  if (!value) 
    return 'El nombre de usuario es obligatorio';

  if (value.length < 3 || value.length > 50) 
    return 'El nombre de usuario debe contener entre 3 y 50 caracteres';

  if (!/^[a-zA-Z0-9._-]+$/.test(value)) 
    return 'El nombre de usuario contiene caracteres no permitidos';

  return null;
}


function validateEmail(email) {
  const value = normalizeText(email).toLowerCase();

  if (!value) 
    return 'El correo electrónico es obligatorio';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) 
    return 'El correo electrónico no tiene un formato válido';

  if (value.length > 150) 
    return 'El correo electrónico es demasiado largo';

  return null;
}


function validatePassword(password) {
  if (typeof password !== 'string') 
    return 'La contraseña es obligatoria';

  if (password.length < 12) 
    return 'La contraseña debe contener al menos 12 caracteres';

  if (!/[A-Z]/.test(password)) 
    return 'La contraseña debe contener al menos una letra mayúscula';

  if (!/[a-z]/.test(password)) 
    return 'La contraseña debe contener al menos una letra minúscula';

  if (!/[0-9]/.test(password)) 
    return 'La contraseña debe contener al menos un número';

  if (!/[^A-Za-z0-9]/.test(password)) 
    return 'La contraseña debe contener al menos un carácter especial';

  return null;
}


function validateRole(role) {
  if (!VALID_ROLES.includes(role)) 
    return 'El rol proporcionado no es válido';

  return null;
}


function createUsuarioDto(body = {}) {
  const username = normalizeText(body.username);

  const email = normalizeText(body.email).toLowerCase();

  const password = body.password;

  const role = normalizeText(body.role) || 'user';


  const errors = [];


  const usernameError = validateUsername(username);

  if (usernameError) 
    errors.push(usernameError);

  const emailError = validateEmail(email);

  if (emailError) 
    errors.push(emailError);


  const passwordError = validatePassword(password);

  if (passwordError) 
    errors.push(passwordError);


  const roleError = validateRole(role);

  if (roleError) 
    errors.push(roleError);


  return {
    valid: errors.length === 0,
    errors,

    data: {
      username,
      email,
      password,
      role
    }
  };
}


function updateUsuarioDto(body = {}) {
  const data = {};
  const errors = [];


  if (body.username !== undefined) {
    const username =
      normalizeText(body.username);

    const error =
      validateUsername(username);

    if (error) {
      errors.push(error);
    } else {
      data.username = username;
    }
  }


  if (body.email !== undefined) {
    const email = normalizeText(body.email).toLowerCase();
    const error = validateEmail(email);

    if (error) 
      errors.push(error);
    else 
      data.email = email;
  }


  if (body.role !== undefined) {
    const role = normalizeText(body.role);
    const error = validateRole(role);

    if (error) 
      errors.push(error);
    else 
      data.role = role;
  }


  return {
    valid: errors.length === 0,
    errors,
    data
  };
}


module.exports = {
  createUsuarioDto,
  updateUsuarioDto,
  validateUsername,
  validateEmail,
  validatePassword,
  validateRole
};
