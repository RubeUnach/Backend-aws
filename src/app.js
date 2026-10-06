const express = require('express');
const { sequelize } = require('./infrastructure/database/sequelize');
const usuarioRoutes = require('./routes/usuario.routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');
const authRoutes = require('./routes/auth.routes');
const helmet = require('helmet');
const cors = require('cors');
const env = require('./config/env');

const app = express();

app.set('trust proxy', env.proxy.trust);

//eliminanos la cabecera HTTP que express agrega por defecto para indicar que el nuestra apirest esta contruida con express
app.disable('x-powered-by'); 


// HSTS se habilitará únicamente cuando despleguemos mediante HTTPS.   
app.use(helmet({strictTransportSecurity: env.nodeEnv === 'production' ? {maxAge: 31536000, includeSubDomains: true} : false}));


app.use(cors({origin: 
  function (origin, callback) {
  // Solicitudes sin Origin: curl, Postman, servidor-servidor.       
    if (!origin) 
      return callback(null, true);

    if (origin === env.frontend.origin)
      return callback(null, true);

    const error = new Error('Origen no permitido por CORS');

    error.code = 'CORS_NOT_ALLOWED';

    return callback(error);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false

}));


app.use(express.json({limit: '10kb'}));

app.get('/api/health', async (req, res) => {
  try {

    await sequelize.query('SELECT 1 AS database_status');

    return res.status(200).json({
      status: 'ok',
      service: 'zero-trust-backend',
      database: 'ok',
      persistence: 'sequelize'
    });

  } catch (error) {

      return res.status(503).json({
        status: 'error',
        service: 'zero-trust-backend',
        database: 'unavailable'
      });
    }
  }
);


app.use(
  '/api/usuarios',
  usuarioRoutes
);

app.use(
  '/api/auth',
  authRoutes
);

app.use(
  notFoundHandler
);


app.use(
  errorHandler
);


module.exports = app;
