const mongoose = require('mongoose');
const validator = require('validator');

const validateUrl = (link) => validator.isURL(link);

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  link: {
    type: String,
    required: true,
    validate: {
      validator: validateUrl,
      message: 'Неправильный формат почты',
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],

  createdAt: {
    type: Date,
    default: Date.now(),
  },

});

module.exports = mongoose.model('card', cardSchema);
