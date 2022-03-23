const User = require('../models/user');
const ErrorNotFound = require('../Errors/ErrorNotFound');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((data) => res.send({ data }))
    .catch((err) => {
      res
        .status(500)
        .send({ message: 'Произошла внутренняя ошибка сервера', error: err });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new ErrorNotFound(`Нет карточки с id ${req.params.cardId}`);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.errorMessage });
      }
      res
        .status(500)
        .send({ message: 'Произошла внутренняя ошибка сервера', error: err });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      res
        .status(500)
        .send({ message: 'Произошла внутренняя ошибка сервера', error: err });
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
      upsert: true,
    },
  )
    .orFail(() => {
      throw new ErrorNotFound(`Нет карточки с id ${req.params.cardId}`);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.errorMessage });
      }
      res
        .status(500)
        .send({ message: 'Произошла внутренняя ошибка сервера', error: err });
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
      throw new ErrorNotFound(`Нет карточки с id ${req.params.cardId}`);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.errorMessage });
      }
      res
        .status(500)
        .send({ message: 'Произошла внутренняя ошибка сервера', error: err });
    });
};
