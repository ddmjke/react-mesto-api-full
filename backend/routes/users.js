const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const linkRegEx = require('../utils/regexes');
const {
  getUsers, getUserById, patchUser, patchAvatar, getUser,
} = require('../controllers/users');

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(linkRegEx),
  }),
}), patchAvatar);

router.get('/me', getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), patchUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);

router.get('/', getUsers);

module.exports = router;
