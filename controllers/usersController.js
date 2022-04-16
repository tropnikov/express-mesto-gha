const { NODE_ENV, SECRET_KEY } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ValidationError = require('../errors/ValidationError');
const User = require('../models/userModel');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getProfile = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .orFail(() => {
      throw new NotFoundError(
        `Запрашиваемый пользователь с id ${req.user._id} не найден`,
      );
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => next(err));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError(
        `Запрашиваемый пользователь с id ${req.params.userId} не найден`,
      );
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Невалидный id пользователя'));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(
          'Пользователь с таким email уже зарегистрирован',
        );
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const userWithoutPass = user.toObject();
      delete userWithoutPass.password;
      res.status(200).send(userWithoutPass);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Невалидный id пользователя'));
      }
      return next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFoundError(
        `Запрашиваемый пользователь с id ${req.params.userId} не найден`,
      );
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Невалидный id пользователя'));
      }
      return next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFoundError(
        `Запрашиваемый пользователь с id ${req.params.userId} не найден`,
      );
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Невалидный id пользователя'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? SECRET_KEY : 'some-secret-key',
        {
          expiresIn: '7d',
        },
      );
      return res
        .cookie('token', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .json({ message: 'Успешная авторизация' });
    })
    .catch(() => {
      next(new UnauthorizedError('Невалидный id пользователя'));
    });
};

module.exports.logout = (req, res) => {
  res.status(200).clearCookie('token', {
    httpOnly: true,
    sameSite: true,
  }).json({ message: 'Вы вышли' });
};
