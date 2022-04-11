const Card = require('../models/cardModel');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const {
  NOT_FOUND_CODE,
  BAD_REQUEST_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require('../errors/errorCodes');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((data) => res.send({ data }))
    .catch((err) => {
      next(err);
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Невалидные данные карточки' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: 'Произошла внутренняя ошибка сервера' });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError(
        `Запрашиваемая карточка с id ${req.params.cardId} не найдена`,
      );
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Чужие карточки удалять нельзя');
      }
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.statusCode === NOT_FOUND_CODE) {
        return res.status(NOT_FOUND_CODE).send({ message: err.errorMessage });
      }
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Невалидный id карточки' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: 'Произошла внутренняя ошибка сервера' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError(
        `Запрашиваемая карточка с id ${req.params.cardId} не найдена`,
      );
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.statusCode === NOT_FOUND_CODE) {
        return res.status(NOT_FOUND_CODE).send({ message: err.errorMessage });
      }
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Невалидный id карточки' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: 'Произошла внутренняя ошибка сервера' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError(
        `Запрашиваемая карточка с id ${req.params.cardId} не найдена`,
      );
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.statusCode === NOT_FOUND_CODE) {
        return res.status(NOT_FOUND_CODE).send({ message: err.errorMessage });
      }
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Невалидный id карточки' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: 'Произошла внутренняя ошибка сервера' });
    });
};
