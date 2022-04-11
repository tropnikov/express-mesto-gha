const { celebrate, Joi } = require('celebrate');

const register = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports = { register };
