const routes = require('express').Router();
const {
  getUsers,
  getProfile,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/usersController');
const { getUser, updateUser, updateAvatarVal } = require('../middlewares/validation');

routes.get('/', getUsers);
routes.get('/me', getProfile);
routes.get('/:userId', getUser, getUserById);
routes.patch('/me', updateUser, updateProfile);
routes.patch('/me/avatar', updateAvatarVal, updateAvatar);

module.exports = routes;
