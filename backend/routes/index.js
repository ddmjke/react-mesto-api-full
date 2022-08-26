const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const linkRegEx = require('../utils/regexes');
const NotFoundError = require('../utils/errors/NotFoundError');
const corshandler = require('../middlewares/corshandler');

router.use(corshandler);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(linkRegEx),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.use('/users', auth, require('./users'));

router.use('/cards', auth, require('./cards'));

router.use('/*', auth, () => { throw new NotFoundError(); });
