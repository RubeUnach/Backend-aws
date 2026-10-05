const usuarioRepository =
  require('../repositories/usuario.repository');

const {
  hashPassword
} = require('../infrastructure/security/password.service');


/**
 * Crea errores de aplicación sin acoplar
 * la capa Service a Express o HTTP.
 */
function createServiceError(code, message) {
  const error = new Error(message);
  error.code = code;

  return error;
}


/**
 * Crea un nuevo usuario.
 */
async function createUser({
  username,
  email,
  password,
  role = 'user'
}) {
  const existingUsername =
    await usuarioRepository.findByUsername(
      username
    );

  if (existingUsername) {
    throw createServiceError(
      'USERNAME_ALREADY_EXISTS',
      'El nombre de usuario ya se encuentra registrado'
    );
  }


  const existingEmail =
    await usuarioRepository.findByEmail(
      email
    );

  if (existingEmail) {
    throw createServiceError(
      'EMAIL_ALREADY_EXISTS',
      'El correo electrónico ya se encuentra registrado'
    );
  }


  const passwordHash =
    await hashPassword(password);


  return usuarioRepository.create({
    username,
    email,
    passwordHash,
    role
  });
}


/**
 * Obtiene todos los usuarios.
 */
async function getAllUsers() {
  return usuarioRepository.findAll();
}


/**
 * Obtiene un usuario mediante ID.
 */
async function getUserById(id) {
  const usuario =
    await usuarioRepository.findById(id);

  if (!usuario) {
    throw createServiceError(
      'USER_NOT_FOUND',
      'Usuario no encontrado'
    );
  }

  return usuario;
}


/**
 * Actualiza información general del usuario.
 */
async function updateUser(
  id,
  {
    username,
    email,
    role
  }
) {
  const current =
    await usuarioRepository.findById(id);

  if (!current) {
    throw createServiceError(
      'USER_NOT_FOUND',
      'Usuario no encontrado'
    );
  }


  if (
    username &&
    username !== current.username
  ) {
    const existingUsername =
      await usuarioRepository.findByUsername(
        username
      );

    if (existingUsername) {
      throw createServiceError(
        'USERNAME_ALREADY_EXISTS',
        'El nombre de usuario ya se encuentra registrado'
      );
    }
  }


  if (
    email &&
    email !== current.email
  ) {
    const existingEmail =
      await usuarioRepository.findByEmail(
        email
      );

    if (existingEmail) {
      throw createServiceError(
        'EMAIL_ALREADY_EXISTS',
        'El correo electrónico ya se encuentra registrado'
      );
    }
  }


  return usuarioRepository.update(
    id,
    {
      username,
      email,
      role
    }
  );
}


/**
 * Activa o desactiva al usuario.
 *
 * No realizamos DELETE físico.
 */
async function setUserActive(
  id,
  active
) {
  const current =
    await usuarioRepository.findById(id);

  if (!current) {
    throw createServiceError(
      'USER_NOT_FOUND',
      'Usuario no encontrado'
    );
  }

  return usuarioRepository.setActive(
    id,
    active
  );
}


module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  setUserActive
};
