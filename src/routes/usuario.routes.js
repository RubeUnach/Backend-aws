const express =
  require('express');

const usuarioController =
  require('../controllers/usuario.controller');

const {
  createUsuarioDto,
  updateUsuarioDto,
  statusUsuarioDto
} = require('../dto/usuario.dto');

const {
  validate,
  validateIdParam
} = require(
  '../middlewares/validate.middleware'
);

const {
  authenticate,
  authorize
} = require(
  '../middlewares/auth.middleware'
);


const router =
  express.Router();


router.get(
  '/',
  authenticate,
  authorize('admin'),
  usuarioController.findAll
);


router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(createUsuarioDto),
  usuarioController.create
);

router.get(
  '/:id',
  authenticate,
  authorize('admin'),
  validateIdParam,
  usuarioController.findById
);


router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validateIdParam,
  validate(updateUsuarioDto),
  usuarioController.update
);


router.patch(
  '/:id/status',
  authenticate,
  authorize('admin'),
  validateIdParam,
  validate(statusUsuarioDto),
  usuarioController.setStatus
);


module.exports =
  router;