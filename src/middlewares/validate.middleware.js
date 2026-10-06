function validate(dtoFactory) {
  return function validationMiddleware(
    req,
    res,
    next
  ) {

    const result =
      dtoFactory(req.body);


    if (!result.valid) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message:
          'Los datos proporcionados no son válidos',
        details:
          result.errors
      });
    }


    req.validatedBody =
      result.data;


    next();
  };
}

function validateIdParam(
  req,
  res,
  next
) {
  const id =
    Number(req.params.id);


  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_ID',
      message:
        'El identificador proporcionado no es válido'
    });
  }


  req.validatedId =
    id;


  next();
}

module.exports = {
  validate,
  validateIdParam
};
