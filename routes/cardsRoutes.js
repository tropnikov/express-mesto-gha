const routes = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cardsController');

routes.get('/', getCards);
routes.post('/', createCard);
routes.delete('/:cardId', deleteCardById);
routes.put('/:cardId/likes', likeCard);
routes.delete('/:cardId/likes', dislikeCard);

module.exports = routes;
