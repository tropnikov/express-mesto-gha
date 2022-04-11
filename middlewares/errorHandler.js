const errorHandler = (err, req, res, next) => {
  const code = err.statusCode || 500;
  res.status(code).send({ message: code === 500 ? 'Произошла внутренняя ошибка сервера' : err.message, err });

  next();
};

module.exports = errorHandler;
