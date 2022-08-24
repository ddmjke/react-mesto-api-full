const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');

const extractBearer = (header) => {
  if (header) header.replace('Bearer ', '');
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Unauthorized'));
  }
  const token = extractBearer(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super_strong_secret');
  } catch (err) {
    next(new UnauthorizedError('Unauthorized'));
  }
  req.user = payload;
  next();
};
