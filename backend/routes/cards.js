const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const linkRegEx = require('../utils/regexes');

const {
  getCards, postCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), dislikeCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), likeCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCard);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(linkRegEx),
  }),
}), postCard);
router.get('/', getCards);

module.exports = router;
