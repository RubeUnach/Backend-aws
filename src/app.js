const express = require('express');

const app = express();

//eliminanos la cabecera HTTP que express agrega por defecto para indicar que el nuestra apirest esta contruida con express
app.disable('x-powered-by'); 

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({status: 'ok', service: 'zero-trust-backend'});
});

module.exports = app;