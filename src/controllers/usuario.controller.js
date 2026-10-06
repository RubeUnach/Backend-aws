const usuarioService =
  require('../services/usuario.service');


async function create(req, res, next) {
  try {
    const usuario =
      await usuarioService.createUser(
        req.validatedBody
      );

    return res.status(201).json({
      success: true,
      message: 'Usuario creado correctamente',
      data: usuario
    });

  } catch (error) {
    next(error);
  }
}

async function findAll(
  req,
  res,
  next
) {
  try {

    const usuarios =
      await usuarioService.getAllUsers();


    return res.status(200).json({
      success: true,
      data: usuarios
    });

  } catch (error) {

    next(error);

  }
}

module.exports = {
  create,
  findAll
};
