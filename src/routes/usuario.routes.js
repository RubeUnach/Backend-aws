const express = require('express');

const usuarioController =
  require('../controllers/usuario.controller');

const {
  createUsuarioDto
} = require('../dto/usuario.dto');

const {
  validate
} = require('../middlewares/validate.middleware');


const router = express.Router();


router.post(
  '/',
  validate(createUsuarioDto),
  usuarioController.create
);


module.exports = router;
