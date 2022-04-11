const routes = require('express').Router();
const {
  getUsers,
  getProfile,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/usersController');

routes.get('/', getUsers);
routes.get('/me', getProfile);
routes.get('/:userId', getUserById);
routes.patch('/me', updateProfile);
routes.patch('/me/avatar', updateAvatar);

module.exports = routes;
