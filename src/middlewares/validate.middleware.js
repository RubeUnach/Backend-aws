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


module.exports = {
  validate
};
