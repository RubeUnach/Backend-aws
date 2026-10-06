const express =
  require('express');

const authController =
  require('../controllers/auth.controller');

const {
  loginDto
} = require('../dto/login.dto');

const {
  validate
} = require(
  '../middlewares/validate.middleware'
);

const {
  authenticate
} = require(
  '../middlewares/auth.middleware'
);


const router =
  express.Router();


router.post(
  '/login',
  validate(loginDto),
  authController.login
);


router.get(
  '/me',
  authenticate,
  authController.me
);


module.exports =
  router;
