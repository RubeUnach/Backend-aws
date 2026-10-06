const express =
  require('express');

const usuarioController =
  require('../controllers/usuario.controller');

const {
  createUsuarioDto
} = require('../dto/usuario.dto');

const {
  validate
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


module.exports =
  router;