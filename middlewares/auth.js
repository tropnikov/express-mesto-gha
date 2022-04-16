const { NODE_ENV, SECRET_KEY } = process.env;
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const authUser = (req, res, next) => {
  //* token is saved in localStorage
  // const { authorization } = req.headers;
  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   return next(new UnauthorizedError('Необходима авторизация'));
  // }
  // const token = authorization.replace('Bearer ', '');

  //* token is saved in cookies
  const { token } = req.cookies;
  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? SECRET_KEY : 'some-secret-key',
    );
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};

module.exports = authUser;
