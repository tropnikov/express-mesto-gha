const Card = require('../models/cardModel');
const ErrorNotFound = require('../Errors/ErrorNotFound');
// const ValidationError = require('../Errors/ValidationError');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((data) => res.send({ data }))
    .catch((err) => {
      res
        .status(500)
        .send({ message: 'Произошла внутренняя ошибка сервера', error: err });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Невалидные данные карточки' });
      }
      return res
        .status(500)
        .send({ message: 'Произошла внутренняя ошибка сервера', error: err });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new ErrorNotFound(`Запрашиваемая карточка с id ${req.params.cardId} не найдена`);
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.statusCode === 404) {
        return res.status(404).send({ message: err.errorMessage });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Невалидный id карточки' });
      }
      return res
        .status(500)
        .send({ message: 'Произошла внутренняя ошибка сервера', error: err });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new ErrorNotFound(`Запрашиваемая карточка с id ${req.params.cardId} не найдена`);
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.statusCode === 404) {
        return res.status(404).send({ message: err.errorMessage });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Невалидный id карточки' });
      }
      return res
        .status(500)
        .send({ message: 'Произошла внутренняя ошибка сервера', error: err });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new ErrorNotFound(`Запрашиваемая карточка с id ${req.params.cardId} не найдена`);
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.statusCode === 404) {
        return res.status(404).send({ message: err.errorMessage });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Невалидный id карточки' });
      }
      return res
        .status(500)
        .send({ message: 'Произошла внутренняя ошибка сервера', error: err });
    });
};
