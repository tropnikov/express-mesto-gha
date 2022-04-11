const { celebrate, Joi } = require('celebrate');

const register = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(
      // eslint-disable-next-line
      /https?:\/\/(w{3}\.)?[-\w@:%.+~#=]+\.[\w()]+([-\w()@:%+.~#?&=\/]*)/,
    ),
  }),
});

const signin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const getUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().required().length(24),
  }),
});

const updateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const updateAvatarVal = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .pattern(
        // eslint-disable-next-line
        /https?:\/\/(w{3}\.)?[-\w@:%.+~#=]+\.[\w()]+([-\w()@:%+.~#?&=\/]*)/,
      ),
  }),
});

const createCardVal = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string()
      .required()
      .pattern(
        // eslint-disable-next-line
        /https?:\/\/(w{3}\.)?[-\w@:%.+~#=]+\.[\w()]+([-\w()@:%+.~#?&=\/]*)/,
      ),
  }),
});

const deleteLikeDislikeCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().required().length(24),
  }),
});

module.exports = {
  register,
  signin,
  getUser,
  updateUser,
  updateAvatarVal,
  createCardVal,
  deleteLikeDislikeCard,
};
