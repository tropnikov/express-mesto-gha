const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const authUser = (req, res, next) => {
  const token = String(req.headers.authorization).replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};

module.exports = authUser;
