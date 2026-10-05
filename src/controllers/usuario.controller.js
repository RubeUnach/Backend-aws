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


module.exports = {
  create
};
