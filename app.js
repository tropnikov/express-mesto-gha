require('dotenv').config();
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { login, createUser, logout } = require('./controllers/usersController');
const NotFoundError = require('./errors/NotFoundError');
const authUser = require('./middlewares/auth');
// const cors = require('./middlewares/corsHandler');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { register, signin } = require('./middlewares/validation');
const cardsRoutes = require('./routes/cardsRoutes');
const usersRoutes = require('./routes/usersRoutes');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mesto');

app.use(express.json());

app.use(
  cors({
    origin: [
      'https://tma.nomoredomains.work',
      'http://tma.nomoredomains.work',
      'localhost:3000',
    ],
    credentials: true,
  }),
);

app.use(requestLogger); // логгер запросов

// app.use(cors);

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});
app.use(limiter);

app.use(cookieParser());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', signin, login);
app.post('/signup', register, createUser);
app.post('/signout', logout);

app.use(authUser);

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена =('));
});

app.use(errorLogger); // логгер ошибок

app.use(errors());

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
