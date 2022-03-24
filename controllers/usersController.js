const User = require('../models/userModel');
const ErrorNotFound = require('../errors/ErrorNotFound');
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

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new ErrorNotFound(
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
          .send({ message: 'Невалидный id пользователя' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: 'Произошла внутренняя ошибка сервера' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
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
      throw new ErrorNotFound(
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
      throw new ErrorNotFound(
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
