const express = require('express');

const authController = require('../controllers/auth.controller');

const { loginDto } = require('../dto/login.dto');

const { validate } = require('../middlewares/validate.middleware');

const { authenticate } = require('../middlewares/auth.middleware');

const { loginLimiter } = require('../middlewares/rate-limit.middleware');

const router = express.Router();


router.post(
  '/login',
  loginLimiter,
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
