const routes = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cardsController');
const {
  createCardVal,
  deleteLikeDislikeCard,
} = require('../middlewares/validation');

routes.get('/', getCards);
routes.post('/', createCardVal, createCard);
routes.delete('/:cardId', deleteLikeDislikeCard, deleteCardById);
routes.put('/:cardId/likes', deleteLikeDislikeCard, likeCard);
routes.delete('/:cardId/likes', deleteLikeDislikeCard, dislikeCard);

module.exports = routes;
