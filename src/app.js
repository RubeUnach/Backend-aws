const express = require('express');
const { pool } = require('./config/database');

const app = express();

//eliminanos la cabecera HTTP que express agrega por defecto para indicar que el nuestra apirest esta contruida con express
app.disable('x-powered-by'); 

app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');

    return res.status(200).json({
      status: 'ok',
      service: 'zero-trust-backend',
      database: 'ok'
    });
  } catch (error) {
    return res.status(503).json({
      status: 'error',
      service: 'zero-trust-backend',
      database: 'unavailable'
    });
  }
});

module.exports = app;