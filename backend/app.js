const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');
const { errors, celebrate, Joi } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const corshandler = require('./middlewares/corshandler');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const linkRegEx = require('./utils/regexes');
const NotFoundError = require('./utils/errors/NotFoundError');

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

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(linkRegEx),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use('/users', auth, require('./routes/users'));

app.use('/cards', auth, require('./routes/cards'));

app.use('/*', auth, () => { throw new NotFoundError(); });
app.use(errorLogger);

app.use(errors());

app.use((err, req, res, _) => {
  res.status(err.statusCode || 500).send({ message: err.message || 'Internal server error' });
});

app.listen(PORT);
