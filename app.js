const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const usersRoutes = require('./routes/usersRoutes');
const cardsRoutes = require('./routes/cardsRoutes');
const { login, createUser } = require('./controllers/usersController');
const errorHandler = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');
const { register, signin } = require('./middlewares/validation');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.post('/signin', signin, login);
app.post('/signup', register, createUser);

app.use(auth);

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена =('));
});

app.use(errors());

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
