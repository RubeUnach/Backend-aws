const authService =
  require('../services/auth.service');


async function login(
  req,
  res,
  next
) {
  try {

    const result =
      await authService.login(
        req.validatedBody
      );


    return res.status(200).json({
      success: true,
      message:
        'Autenticación correcta',
      data: result
    });

  } catch (error) {

    next(error);

  }
}


async function me(
  req,
  res
) {

  return res.status(200).json({
    success: true,

    data: {
      id:
        req.authUser.id,

      username:
        req.authUser.username,

      email:
        req.authUser.email,

      role:
        req.authUser.role,

      active:
        req.authUser.active
    }
  });
}


module.exports = {
  login,
  me
};
