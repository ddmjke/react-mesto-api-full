const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const corshandler = require('./middlewares/corshandler');
const routes = require('./routes/index');

require('dotenv').config();

const { PORT = 3000 } = process.env;

const app = express();

const limit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(helmet());
app.use(limit);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(corshandler);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, _) => {
  res.status(err.statusCode || 500).send({ message: err.message || 'Internal server error' });
});

app.listen(PORT);
