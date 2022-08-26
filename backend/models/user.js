const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const SALT_WORK_FACTOR = 10;

const validateEmail = (email) => validator.isEmail(email);
const validateUrl = (link) => validator.isURL(link);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },

  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },

  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: validateUrl,
      message: 'Неправильный формат почты',
    },
  },

  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: validateEmail,
      message: 'Неправильный формат почты',
    },
  },

  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.pre('save', function named(next) {
  const user = this;
  if (!user.isModified('password')) return next();

  return bcrypt.hash(user.password, SALT_WORK_FACTOR)
    .then((hash) => {
      user.password = hash;
      return next();
    })
    .catch(() => {
      throw new Error('hash error');
    });
});

module.exports = mongoose.model('user', userSchema);
