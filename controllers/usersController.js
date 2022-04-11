const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');

const {
  NOT_FOUND_CODE,
  BAD_REQUEST_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require('../errors/errorCodes');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((data) => res.send({ data }))
    .catch(() => {
      res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: 'Произошла внутренняя ошибка сервера' });
    });
};

module.exports.getProfile = (req, res) => {
  const id = req.user._id;
  User.findById(id)
    .orFail(() => {
      throw new NotFoundError(
        `Запрашиваемый пользователь с id ${req.params.userId} не найден`,
      );
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === NOT_FOUND_CODE) {
        return res.status(NOT_FOUND_CODE).send({ message: err.errorMessage });
      }
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Невалидный id пользователя', err });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: 'Произошла внутренняя ошибка сервера' });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError(
        `Запрашиваемый пользователь с id ${req.params.userId} не найден`,
      );
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === NOT_FOUND_CODE) {
        return res.status(NOT_FOUND_CODE).send({ message: err.errorMessage });
      }
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Невалидный id пользователя', err });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: 'Произошла внутренняя ошибка сервера' });
    });
};

module.exports.createUser = (req, res) => {
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
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      // next(err);
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Невалидные данные пользователя', err });
      }
      if (err.statusCode === 409) {
        return res.status(409).send({ message: 'Ты уже зареган', err });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: 'Произошла внутренняя ошибка сервера' });
    });
};

module.exports.updateProfile = (req, res) => {
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
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === NOT_FOUND_CODE) {
        return res.status(NOT_FOUND_CODE).send({ message: err.errorMessage });
      }
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Невалидные данные пользователя' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: 'Произошла внутренняя ошибка сервера' });
    });
};

module.exports.updateAvatar = (req, res) => {
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
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === NOT_FOUND_CODE) {
        return res.status(NOT_FOUND_CODE).send({ message: err.errorMessage });
      }
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Невалидный id или ссылка' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: 'Произошла внутренняя ошибка сервера' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
      // res
      //   .cookie('jwt', token, {
      //     maxAge: 3600000 * 24,
      //     httpOnly: true,
      //   })
      //   .end();
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
